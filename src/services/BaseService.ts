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
    protected jsonApiSerializer: JsonApiSerializer;

    constructor(client: Client, endpoint: string) {
        super();
        this.client = client;
        this.endpoint = endpoint;
        this.hydrator = new Hydrator();
        this.jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
    }

    convertToJsonApi(model: Model) {
        return this.jsonApiSerializer.buildCreatePayload(model);
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

    async create(model: T, params?: unknown): Promise<InternalResponse<T>> {
        if (params) {
        }
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildCreatePayload(model);
        return await this.client.makePostRequest(this.endpoint, payload);
    }

    async update(id: string, model: Model, params?: unknown): Promise<InternalResponse<T>> {
        if (params) {
        }
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildUpdatePayload(model);
        return await this.client.makePatchRequest(`${this.endpoint}/${id}`, payload);
    }

    async stats<R = any>(options?: RequestOptionsType): Promise<InternalResponse<R>> {
        const statsEndpoint = `${this.endpoint}/stats`;
        const { requestOptions } = this.buildRequestParams('', options);
        const resp = await this.client.makeGetRequest(statsEndpoint, requestOptions);

        if (resp.data && typeof resp.data === 'object') {
            resp.data = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        }

        return resp as InternalResponse<R>;
    }
}
