import { Client } from "../Client";
import { InternalResponse, JsonData } from '../types/Response';
import { RequestOptionsType } from "../utils/RequestOptions";
import { ModelRegistry } from "../utils/ModelRegistry";
import { Hydrator } from "../utils/Hydrator";
import { RequestBuilder } from '../utils/RequestBuilder';
import type { Model } from "types/Model";

export class BaseService<T> extends RequestBuilder {
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
        resp.data = this.hydrator.hydrateResponse<T>(resp.data as JsonData | JsonData[], resp.included || []);
        this.clearRequestOptions();
        return resp;
    }

    async create(model: Model): Promise<InternalResponse<T>> {
        return await this.client.makePostRequest(this.endpoint, {
            data: {
                type: model.type,
                attributes: model.attributes,
                relationships: model.relationships,
            }
        });
    }

}