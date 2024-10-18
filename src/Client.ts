import { ClientConfigInterface} from "./ClientConfig";
import { RequestOptions } from "./utils/RequestOptions";
import { Requests } from "./utils/Requests";
import { Hydrator } from "./utils/Hydrator";
import { FormCategoriesService } from "./services/FormCategoriesService";
import { RolesService } from "./services/RolesService";
import { PermissionsService } from "./services/PermissionsService";
import { SubmissionsService } from "./services/SubmissionsService";
import { FormsService } from "./services/FormsService";
import { ServiceAccountsService } from "./services/ServiceAccountService";
import { ServiceAccountKeysService } from "./services/ServiceAccountKeysService";
import {InternalResponse} from "./types/Response";

export class Client {
  readonly config: ClientConfigInterface;
  public organisation: string;
  public services: Record<string, any> = {};
  public hydrator: Hydrator;

  constructor(config: ClientConfigInterface) {
    this.config = config;
    this.organisation = "";
    this.hydrator = new Hydrator(this.services);
  }

  public roles(): RolesService {
    return new RolesService(this);
  }

  public serviceAccountKeys(): ServiceAccountKeysService {
    return new ServiceAccountKeysService(this);
  }

  public serviceAccounts(): ServiceAccountsService {
    return new ServiceAccountsService(this);
  }

  public formCategories(): FormCategoriesService {
    return new FormCategoriesService(this);
  }

  public forms(): FormsService {
    return new FormsService(this);
  }

  public submissions(): SubmissionsService {
    return new SubmissionsService(this);
  }

  public permissions(): PermissionsService {
    return new PermissionsService(this);
  }

  getServiceEndpoint(serviceName: string): String {
    return this.services[serviceName] ? this.services[serviceName].endpoint : '';
  }

  setOrganisationSlug(organisation: string) {
    this.config.organisationId = organisation;
  }

  finalEndpoint(url: string): string {
    return `${this.config.baseDomain}${url.replace(":orgId", this.config.organisationId.toString())}`;
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
    param?: string | RequestOptions,
  ): Promise<InternalResponse> {
    let url = Requests.buildRequestURL(baseEndpoint, param);

    try {
      // @todo switch on cookie, "X-Session-Token" or client_credentials
      const fetchResponse = await fetch(url, {
        credentials: "include", // @todo only required for cookie based auth,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      let json = await fetchResponse.json();
      return Requests.buildInternalResponse(fetchResponse, json);
    } catch (error) {
      return Requests.buildInternalErrorResponse(error);
    }
  }

}
