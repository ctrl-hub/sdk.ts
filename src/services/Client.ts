import { ClientConfig } from "./ClientConfig";
import { RequestOptions, RequestOptionsType } from "../utils/RequestOptions";
import { FormCategory } from "../models/FormCategory";
import { Role } from "../models/Role";
import { Permission } from "../models/Permission";
import { Requests } from "../utils/Requests";
import { ServiceAccount } from "../models/ServiceAccount";
import { ServiceAccountKey } from "../models/ServiceAccountKey";
import { Hydrator } from "../utils/Hydrator";
import type { Service } from "../types/Service";
import type { ServiceMethods } from "../types/ServiceMethods";
import type { ModelConstructor } from "../types/ModelConstructor";
import type { InternalResponse } from "../types/Response";
import {Form} from "@models/Form";
import {Submission} from "@models/Submission";
import {Model} from "@src/types/Model";

export class Client {
  readonly config: ClientConfig;
  public organisation: string;
  public services: Record<string, Service> = {};
  public hydrator: Hydrator;

  // @ts-ignore
  public submissions: ServiceMethods;
  // @ts-ignore
  public forms: ServiceMethods;
  // @ts-ignore
  public formCategories: ServiceMethods;
  // @ts-ignore
  public roles: ServiceMethods;
  // @ts-ignore
  public permissions: ServiceMethods;
  // @ts-ignore
  public serviceAccounts: ServiceMethods;

  constructor(config: ClientConfig) {
    this.config = config;
    this.organisation = "";

    this.services["formCategories"] = {
      endpoint: "/v3/orgs/:orgId/data-capture/form-categories",
      model: FormCategory as ModelConstructor<FormCategory>,
      type: "form-categories",
    };

    this.services["forms"] = {
      endpoint: "/v3/orgs/:orgId/data-capture/forms",
      model: Form as ModelConstructor<Form>,
      type: "forms",
    };

    this.services["submissions"] = {
      endpoint: "/v3/orgs/:orgId/data-capture/submissions",
      model: Submission as ModelConstructor<Submission>,
      type: "submissions",
    };

    this.services["permissions"] = {
      endpoint: "/v3/admin/permissions",
      model: Permission as ModelConstructor<Permission>,
      type: "permissions",
    };

    this.services["roles"] = {
      endpoint: "/v3/admin/iam/roles",
      model: Role as ModelConstructor<Role>,
      type: "roles",
    };

    this.services["serviceAccounts"] = {
      endpoint: "/v3/orgs/:orgId/admin/iam/service-accounts",
      model: ServiceAccount as ModelConstructor<ServiceAccount>,
      type: "service-accounts",
    };

    this.services["serviceAccountKeys"] = {
      endpoint: "/v3/orgs/:orgId/admin/iam/service-accounts",
      model: ServiceAccountKey as ModelConstructor<ServiceAccountKey>,
      type: "service-account-keys",
    };

    this.hydrator = new Hydrator(this.services);

    // ensure we can do (as example):
    // client.formCategories.get() and return hydrated models based on this.services['formCategories']
    return this.setupProxies();
  }

  setOrganisationSlug(organisation: string) {
    this.config.organisationId = organisation;
  }

  finalEndpoint(service: Service): string {
    return `${this.config.baseDomain}${service.endpoint.replace(":orgId", this.config.organisationId.toString())}`;
  }

  public async create(model: Model) {
    let service = Object.values(this.services).find(service => service.type === model.type);

    if (!service) {
      throw new Error(`Service not found for model type ${model.type}`);
    }

    let requestBody = {
      type: model.type,
      data: {
        attributes: model.attributes
      }
    }

    let endpoint = this.finalEndpoint(service);

    return await this.makePostRequest(endpoint, requestBody)
  }

  private setupProxies() {
    return new Proxy(this, {
      get: <T>(client: Client, service: string) => {
        if (service in client.services) {
          const serviceInfo = client.services[service];

          return new Proxy(
            {},
            {
              get: (_, method) => {
                if (method === "get") {
                  return (
                    param: string | RequestOptionsType | null,
                  ): Promise<InternalResponse> => {
                    // cleanup
                    if (typeof param === "string") {
                      // @ts-ignore
                      return client.getResource<T>(serviceInfo, param);
                    }
                    const requestOptions = param
                      ? new RequestOptions(param)
                      : null;
                    // @ts-ignore
                    return client.getResource<T>(serviceInfo, requestOptions);
                  };
                }
                return () =>
                  `Method ${method.toString()} called on service ${service}`;
              },
            },
          );
        }

        return Reflect.get(client, service);
      },
    });
  }

  async makePostRequest(
      baseEndpoint: string,
      body?: any, // Request body (e.g., JSON object)
      param?: string | RequestOptions | null,
      headers?: Record<string, string>, // Optional headers
  ): Promise<any> {
    let url = Requests.buildRequestURL(baseEndpoint, param);

    try {
      const fetchResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        credentials: 'include',
        body: JSON.stringify(body), // Stringify the body if it's a JSON object
      });

      let json = await fetchResponse.json();
      return Requests.buildInternalResponse(fetchResponse, json);
    } catch (error) {
      return Requests.buildInternalErrorResponse(error);
    }
  }

  async makeGetRequest(
    baseEndpoint: string,
    param?: string | RequestOptions | null,
  ): Promise<any> {
    let url = Requests.buildRequestURL(baseEndpoint, param);

    try {
      // @todo switch on cookie, "X-Session-Token" or client_credentials
      const fetchResponse = await fetch(url, {
        credentials: "include", // @todo only required for cookie based auth
      });
      let json = await fetchResponse.json();
      return Requests.buildInternalResponse(fetchResponse, json);
    } catch (error) {
      return Requests.buildInternalErrorResponse(error);
    }
  }

  async getResource(
    service: Service,
    param: string | RequestOptions | null,
  ): Promise<InternalResponse> {
    const response = await this.makeGetRequest(
      this.finalEndpoint(service),
      param,
    );
    return this.hydrator.hydrateResponse(service, response);
  }
}
