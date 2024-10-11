import { ClientConfig } from "./ClientConfig";
import { RequestOptions } from "../utils/RequestOptions";
import {FormCategory} from "../models/FormCategory";
import {ModelServiceInterface} from "../interfaces/ModelServiceInterface";
import {Requests} from "../utils/Requests";

type Service = {
    get: Function;
    create: Function;
}

export class Client {
    readonly config: ClientConfig;
    public organisation: string;
    public services: Record<string, any> = {};  // To hold service instances
    public formCategories: Service;

    constructor(config: ClientConfig) {
        this.config = config;
        this.organisation = '';

        this.services['formCategories'] = {
            endpoint: '/v3/orgs/:orgId/data-capture/form-categories',
            model: FormCategory,
        };

        return new Proxy(this, {
            get: (client, service) => {
                if (service in client.services) {
                    // Intercept `client.formCategories` etc and return proxy
                    return new Proxy({}, {
                        get: (_, method) => {
                            if (method === 'get') {
                                return (param: any[]) => client.getResource(client.services[service], param);
                            }
                            return () => `Method ${method.toString()} called on service ${service}`;
                        }
                    });
                }

                // Default behavior for non-service properties
                return Reflect.get(client, service);
            }
        });

    }

    async getResource(service: any, param: any) {
        let response = await this.makeGetRequest(this.finalEndpoint(service), param);

        if (response.data) {
            const ModelClass = service.model;  // Get the dynamic model class e.g. FormCategory
            const dataArray = Array.isArray(response.data) ? response.data : [response.data];
            response.data = dataArray.map(item => new ModelClass(item.attributes, item.id, item.type, item.meta));
        }

        return response;
    }

    setOrganisationSlug(organisation: string) {
        this.config.organisationId = organisation;
    }

    finalEndpoint(service: ModelServiceInterface): string {
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