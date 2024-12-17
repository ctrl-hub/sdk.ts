import { Client } from "../Client";
import type { InternalResponse, JsonData } from '../types/Response';
import type { RequestOptionsType } from "../utils/RequestOptions";
import { Hydrator } from "../utils/Hydrator";
import { RequestBuilder } from '../utils/RequestBuilder';
import type { Model } from '../types/Model';

export class BaseService<T extends Model> extends RequestBuilder {
    protected client: Client;
    protected endpoint: string;
    protected hydrator: Hydrator;

    constructor(client: Client, endpoint: string) {
        super();
        this.client = client;
        this.endpoint = endpoint;
        this.hydrator = new Hydrator();
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
        if ('getApiMapping' in model.constructor.prototype) {
            const mapping = model.constructor.prototype.getApiMapping() as {
                attributes?: string[];
                relationships?: Record<string, string>;
            };

            const payload = {
                data: {
                    type: model.type,
                    attributes: {} as Record<string, any>,
                    relationships: {} as Record<string, { data: { type: string, id: string } }>
                }
            };

            mapping.attributes?.forEach((attr: string) => {
                payload.data.attributes[attr] = (model as any)[attr];
            });

            if (mapping.relationships) {
                Object.entries(mapping.relationships).forEach(([key, type]) => {
                    const relationshipValue = (model as any)[key];
                    if (relationshipValue) {
                        payload.data.relationships[key] = {
                            data: {
                                type,
                                id: relationshipValue
                            }
                        };
                    }
                });
            }

            return await this.client.makePostRequest(this.endpoint, payload);
        }

        // default to using all attributes (anything that's not type or id)
        const {type, id, ...attributes} = model;
        return await this.client.makePostRequest(this.endpoint, {
            data: {
                type: model.type,
                attributes
            }
        });
    }

}
