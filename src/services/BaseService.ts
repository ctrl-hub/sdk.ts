import { Client } from "../Client";
import type { InternalResponse, JsonData } from '../types/Response';
import type { RequestOptionsType } from "../utils/RequestOptions";
import { ModelRegistry } from "../utils/ModelRegistry";
import { Hydrator } from "../utils/Hydrator";
import { RequestBuilder } from '../utils/RequestBuilder';
import type { Model } from '../types/Model';

export class BaseService<T extends Model> extends RequestBuilder {
    protected client: Client;
    protected endpoint: string;
    protected modelRegistry: ModelRegistry;
    protected hydrator: Hydrator;

    constructor(client: Client, endpoint: string) {
        super();
        this.client = client;
        this.endpoint = endpoint;
        this.modelRegistry = ModelRegistry.getInstance();
        this.hydrator = new Hydrator(this.modelRegistry);
    }

    // Overloads for get method
    async get(): Promise<InternalResponse<T[]>>;
    async get(param: string): Promise<InternalResponse<T>>;
    async get(param: string, options?: RequestOptionsType): Promise<InternalResponse<T>>;
    async get(param: RequestOptionsType): Promise<InternalResponse<T[]>>;
    async get(
        param?: string | RequestOptionsType,
        options?: RequestOptionsType
    ): Promise<InternalResponse<T | T[]>> {
        const {endpoint, requestOptions} = this.buildRequestParams(this.endpoint, param, options);
        let resp = await this.client.makeGetRequest(endpoint, requestOptions);

        const hydratedData = this.hydrator.hydrateResponse<T>(
            resp.data as JsonData | JsonData[],
            resp.included || []
        );

        return {
            ...resp,
            data: hydratedData
        } as InternalResponse<T | T[]>;
    }

    async create(model: Model): Promise<InternalResponse<T>> {
        let modelType = model.type;
        let ModelClass = this.modelRegistry.models[modelType];
        let payload: {
            data: {
                type: string;
                attributes: Record<string, any>;
                relationships?: Record<string, {
                    data: {
                        type: string;
                        id: string;
                    }
                }>;
            }
        };

        if ('getApiMapping' in ModelClass.prototype) {
            const mapping = ModelClass.prototype.getApiMapping() as {
                attributes: string[];
                relationships: Record<string, string>;
            };

            payload = {
                data: {
                    type: model.type,
                    attributes: {}
                }
            };

            mapping.attributes.forEach((attr: string) => {
                payload.data.attributes[attr] = (model as Record<string, any>)[attr];
            });

            if (mapping.relationships) {
                payload.data.relationships = {};
                Object.entries(mapping.relationships).forEach(([key, type]: [string, string]) => {
                    const relationshipValue = (model as Record<string, any>)[key];
                    if (relationshipValue) {
                        payload.data.relationships![key] = {
                            data: {
                                type,
                                id: relationshipValue
                            }
                        };
                    }
                });
            }
        } else {
            let {type, id, ...rest} = model;
            payload = {
                data: {
                    type: model.type,
                    attributes: rest
                }
            };
        }

        return await this.client.makePostRequest(this.endpoint, payload);
    }

}
