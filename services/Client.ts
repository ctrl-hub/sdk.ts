import { ClientConfig } from "./ClientConfig";
import {RequestOptions, RequestOptionsType} from "../utils/RequestOptions";
import {FormCategory} from "../models/FormCategory";
import {ServiceInterface} from "../interfaces/ServiceInterface";
import {Requests} from "../utils/Requests";
import {ModelConstructor} from "../interfaces/ModelConstructorInterface";
import {InternalResponse} from "../interfaces/ResponseInterface";
import {ServiceAccount} from "../models/ServiceAccount";
import {ServiceMethods} from "../interfaces/ServiceMethods";

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
        };

        this.services['serviceAccounts'] = {
            endpoint: '/v3/orgs/:orgId/settings/iam/service-accounts',
            model: ServiceAccount as ModelConstructor<ServiceAccount>,
        };

        // ensure we can do (as example):
        // client.formCategories.get() and return hydrated models based on this.services['formCategories']
        return this.setupProxies();
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

    async getResource(service: ServiceInterface, param: string | RequestOptions | null): Promise<InternalResponse> {
        let response = await this.makeGetRequest(this.finalEndpoint(service), param);

        if (response.data) {
            const ModelClass = service.model;  // Get the dynamic model class e.g. FormCategory
            if (Array.isArray(response.data)) {
                response.data = response.data.map(item => ModelClass.hydrate(item));
            } else {
                response.data = ModelClass.hydrate(response.data);
            }

        }

        return response;
    }

    setOrganisationSlug(organisation: string) {
        this.config.organisationId = organisation;
    }

    finalEndpoint(service: ServiceInterface): string {
        return `${this.config.baseDomain}${service.endpoint.replace(':orgId', this.config.organisationId.toString())}`;
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

    // create(model: ModelInterface) {
    //     console.log(JSON.stringify({
    //         action: 'create',
    //         type: model.type,
    //         organisation: this.organisation,
    //         endpoint: this.finalEndpoint(model),
    //         entity: model
    //     }, null, 2));
    // }
    //
    // update(model: ModelInterface) {
    //     console.log(JSON.stringify({
    //         action: 'update',
    //         type: model.type,
    //         organisation: this.organisation,
    //         endpoint: this.finalEndpoint(model),
    //         entity: model
    //     }, null, 2));
    // }
}