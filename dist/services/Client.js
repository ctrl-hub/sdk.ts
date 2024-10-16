import { RequestOptions } from "../utils/RequestOptions";
import { FormCategory } from "../models/FormCategory";
import { Role } from "../models/Role";
import { Permission } from "../models/Permission";
import { Requests } from "../utils/Requests";
import { ServiceAccount } from "../models/ServiceAccount";
import { ServiceAccountKey } from "../models/ServiceAccountKey";
import { Hydrator } from "../utils/Hydrator";
import { Form } from "@models/Form";
export class Client {
    config;
    organisation;
    services = {};
    hydrator;
    // @ts-ignore
    forms;
    // @ts-ignore
    formCategories;
    // @ts-ignore
    roles;
    // @ts-ignore
    permissions;
    // @ts-ignore
    serviceAccounts;
    constructor(config) {
        this.config = config;
        this.organisation = "";
        this.services["formCategories"] = {
            endpoint: "/v3/orgs/:orgId/data-capture/form-categories",
            model: FormCategory,
            type: "form-categories",
        };
        this.services["forms"] = {
            endpoint: "/v3/orgs/:orgId/data-capture/forms",
            model: Form,
            type: "forms",
        };
        this.services["permissions"] = {
            endpoint: "/v3/admin/permissions",
            model: Permission,
            type: "permissions",
        };
        this.services["roles"] = {
            endpoint: "/v3/admin/iam/roles",
            model: Role,
            type: "roles",
        };
        this.services["serviceAccounts"] = {
            endpoint: "/v3/orgs/:orgId/admin/iam/service-accounts",
            model: ServiceAccount,
            type: "service-accounts",
        };
        this.services["serviceAccountKeys"] = {
            endpoint: "/v3/orgs/:orgId/admin/iam/service-accounts",
            model: ServiceAccountKey,
            type: "service-account-keys",
        };
        this.hydrator = new Hydrator(this.services);
        // ensure we can do (as example):
        // client.formCategories.get() and return hydrated models based on this.services['formCategories']
        return this.setupProxies();
    }
    setOrganisationSlug(organisation) {
        this.config.organisationId = organisation;
    }
    finalEndpoint(service) {
        return `${this.config.baseDomain}${service.endpoint.replace(":orgId", this.config.organisationId.toString())}`;
    }
    setupProxies() {
        return new Proxy(this, {
            get: (client, service) => {
                if (service in client.services) {
                    const serviceInfo = client.services[service];
                    return new Proxy({}, {
                        get: (_, method) => {
                            if (method === "get") {
                                return (param) => {
                                    // cleanup
                                    if (typeof param === "string") {
                                        // @ts-ignore
                                        return client.getResource(serviceInfo, param);
                                    }
                                    const requestOptions = param
                                        ? new RequestOptions(param)
                                        : null;
                                    // @ts-ignore
                                    return client.getResource(serviceInfo, requestOptions);
                                };
                            }
                            return () => `Method ${method.toString()} called on service ${service}`;
                        },
                    });
                }
                return Reflect.get(client, service);
            },
        });
    }
    async makeGetRequest(baseEndpoint, param) {
        let url = Requests.buildRequestURL(baseEndpoint, param);
        try {
            // @todo switch on cookie, "X-Session-Token" or client_credentials
            const fetchResponse = await fetch(url, {
                credentials: "include", // @todo only required for cookie based auth
            });
            let json = await fetchResponse.json();
            return Requests.buildInternalResponse(fetchResponse, json);
        }
        catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }
    async getResource(service, param) {
        const response = await this.makeGetRequest(this.finalEndpoint(service), param);
        return this.hydrator.hydrateResponse(service, response);
    }
}
