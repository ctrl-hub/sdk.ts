import { ClientConfig } from "./ClientConfig";
import {RequestOptions, RequestOptionsType} from "../utils/RequestOptions";
import {FormCategory} from "../models/FormCategory";
import {ServiceInterface} from "../interfaces/ServiceInterface";
import {Requests} from "../utils/Requests";
import {ModelConstructor} from "../interfaces/ModelConstructorInterface";
import {InternalResponse} from "../interfaces/ResponseInterface";
import {ServiceAccount} from "../models/ServiceAccount";
import {ServiceMethods} from "../interfaces/ServiceMethods";
import {ServiceAccountKey} from "../models/ServiceAccountKey";

export class Client {
    readonly config: ClientConfig;
    public organisation: string;
    public services: Record<string, any> = {};
    public formCategories: ServiceMethods;
    public serviceAccounts: ServiceMethods;

    constructor(config: ClientConfig) {
        this.config = config;
        this.organisation = '';

        this.services['formCategories'] = {
            endpoint: '/v3/orgs/:orgId/data-capture/form-categories',
            model: FormCategory as ModelConstructor<FormCategory>,
            type: 'form-categories',
        };

        this.services['serviceAccounts'] = {
            endpoint: '/v3/orgs/:orgId/settings/iam/service-accounts',
            model: ServiceAccount as ModelConstructor<ServiceAccount>,
            type: 'service-accounts'
        };

        this.services['serviceAccountKeys'] = {
            endpoint: '/v3/orgs/:orgId/settings/iam/service-accounts',
            model: ServiceAccountKey as ModelConstructor<ServiceAccountKey>,
            type: 'service-account-keys'
        };

        // ensure we can do (as example):
        // client.formCategories.get() and return hydrated models based on this.services['formCategories']
        return this.setupProxies();
    }

    setOrganisationSlug(organisation: string) {
        this.config.organisationId = organisation;
    }

    finalEndpoint(service: ServiceInterface): string {
        return `${this.config.baseDomain}${service.endpoint.replace(':orgId', this.config.organisationId.toString())}`;
    }

    hydrateJson(json) {
        let type = json.type;
        let model;

        Object.keys(this.services).forEach(serviceKey => {
            if (this.services[serviceKey].type === type) {
                let modelClass = this.services[serviceKey].model;
                model = new modelClass();
                model.id = json.id;
                model.attributes = json.attributes || {};
                model.relationships = json.relationships || [];
                model.meta = json.meta || {};
                model.links = json.links || [];
            }
        });

        return model || null;
    }

    hydrateRelationships(single: any, included: any[]) {
        if (single.relationships) {
            let primaryKeys = Object.keys(single.relationships);

            primaryKeys.forEach(key => {
                for(let relation of single.relationships[key].data) {
                    let {id, type} = relation;

                    included.forEach((inc, index) => {
                        if (id === inc.id && type === inc.type) {
                            single.relationships[key].data[index] = inc;
                        }
                    })

                }
            });
        }
        return single;
    }

    private setupProxies() {
        return new Proxy(this, {
            get: <T>(client: Client, service: string) => {
                if (service in client.services) {
                    const serviceInfo = client.services[service];

                    return new Proxy({}, {
                        get: (_, method) => {
                            if (method === 'get') {
                                return (param: string | RequestOptionsType | null): Promise<InternalResponse> => {

                                    // cleanup
                                    if (typeof param === "string") {
                                        return client.getResource<T>(serviceInfo, param);
                                    }
                                    const requestOptions = param ? new RequestOptions(param) : null;
                                    return client.getResource<T>(serviceInfo, requestOptions);
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

    async makeGetRequest(baseEndpoint: string, param?: string | RequestOptions | null): Promise<any> {
        let url = Requests.buildRequestURL(baseEndpoint, param);

        try {
            const fetchResponse = await fetch(url);
            let json = await fetchResponse.json();
            return Requests.buildInternalResponse(fetchResponse, json);
        } catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }

    async getResource(service: ServiceInterface, param: string | RequestOptions | null): Promise<InternalResponse> {
        let response = await this.makeGetRequest(this.finalEndpoint(service), param);

        // hydrate all in included
        if (response.included) {
            response.included.forEach((json, index) => {
                response.included[index] = this.hydrateJson(json);
            })
        }

        if (response.data) {
            const ModelClass = service.model;  // Get the dynamic model class e.g. FormCategory
            if (Array.isArray(response.data)) {
                response.data = response.data.map(item => ModelClass.hydrate(item, response));
            } else {
                response.data = ModelClass.hydrate(response.data, response);
            }

            if (Array.isArray(response.data)) {
                response.data.forEach((single, index) => {
                    response.data[index] = this.hydrateRelationships(single, response.included);
                });
            } else {
                response.data = this.hydrateRelationships(response.data, response.included);
            }
        }

        return response;
    }
}