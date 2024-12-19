import { Client } from '../Client';
import type { InternalResponse, JsonData } from '../types/Response';
import type { RequestOptionsType } from '../utils/RequestOptions';
import { Hydrator } from '../utils/Hydrator';
import { RequestBuilder } from '../utils/RequestBuilder';
import type { Model } from '../types/Model';
import { JsonApiSerializer } from '@utils/JsonSerializer';

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
    async get(param?: string | RequestOptionsType, options?: RequestOptionsType): Promise<InternalResponse<T | T[]>> {
        const { endpoint, requestOptions } = this.buildRequestParams(this.endpoint, param, options);
        let resp = await this.client.makeGetRequest(endpoint, requestOptions);

        const hydratedData = this.hydrator.hydrateResponse<T>(resp.data as JsonData | JsonData[], resp.included || []);

        return {
            ...resp,
            data: hydratedData,
        } as InternalResponse<T | T[]>;
    }

    async create(model: Model): Promise<InternalResponse<T>> {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildCreatePayload(model);
        return await this.client.makePostRequest(this.endpoint, payload);
    }

    async update(id: string, model: Model): Promise<InternalResponse<T>> {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildUpdatePayload(model);
        return await this.client.makePatchRequest(`${this.endpoint}/${id}`, payload);
    }
}
