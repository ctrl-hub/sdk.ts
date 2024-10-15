import { RequestOptions } from "../utils/RequestOptions";
import { FormCategory } from "../models/FormCategory";
import { Requests } from "../utils/Requests";
import { ServiceAccount } from "../models/ServiceAccount";
import { ServiceAccountKey } from "../models/ServiceAccountKey";
import { Hydrator } from "../utils/Hydrator";
export class Client {
    config;
    organisation;
    services = {};
    hydrator;
    // @ts-ignore
    formCategories;
    // @ts-ignore
    serviceAccounts;
    constructor(config) {
        this.config = config;
        this.organisation = '';
        this.services['formCategories'] = {
            endpoint: '/v3/orgs/:orgId/data-capture/form-categories',
            model: FormCategory,
            type: 'form-categories',
        };
        this.services['serviceAccounts'] = {
            endpoint: '/v3/orgs/:orgId/admin/iam/service-accounts',
            model: ServiceAccount,
            type: 'service-accounts'
        };
        this.services['serviceAccountKeys'] = {
            endpoint: '/v3/orgs/:orgId/admin/iam/service-accounts',
            model: ServiceAccountKey,
            type: 'service-account-keys'
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
        return `${this.config.baseDomain}${service.endpoint.replace(':orgId', this.config.organisationId.toString())}`;
    }
    setupProxies() {
        return new Proxy(this, {
            get: (client, service) => {
                if (service in client.services) {
                    const serviceInfo = client.services[service];
                    return new Proxy({}, {
                        get: (_, method) => {
                            if (method === 'get') {
                                return (param) => {
                                    // cleanup
                                    if (typeof param === "string") {
                                        // @ts-ignore
                                        return client.getResource(serviceInfo, param);
                                    }
                                    const requestOptions = param ? new RequestOptions(param) : null;
                                    // @ts-ignore
                                    return client.getResource(serviceInfo, requestOptions);
                                };
                            }
                            return () => `Method ${method.toString()} called on service ${service}`;
                        }
                    });
                }
                return Reflect.get(client, service);
            }
        });
    }
    async makeGetRequest(baseEndpoint, param) {
        let url = Requests.buildRequestURL(baseEndpoint, param);
        try {
            const fetchResponse = await fetch(url, {
                credentials: 'include',
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
