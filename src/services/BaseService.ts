import { Client } from "../Client";
import { InternalResponse } from "../types/Response";
import { RequestOptionsType, SingleGetRequestOptionsType } from "../utils/RequestOptions";
import { ModelRegistry } from "../utils/ModelRegistry";
import { Hydrator } from "../utils/Hydrator";
import { Model } from "types/Model";
import {GetRequestParamHandler} from "../utils/GetRequestParamHandler";

interface JsonData {
    id: string;
    type: string;
    attributes?: Record<string, any>;
    relationships?: Record<string, { data: any[] }>;
    meta?: Record<string, any>;
    links?: string[];
}

export class BaseService<T> {
    protected client: Client;
    protected endpoint: string;
    protected modelRegistry: ModelRegistry;
    protected hydrator: Hydrator;

    constructor(client: Client, endpoint: string) {
        this.client = client;
        this.endpoint = endpoint;
        this.modelRegistry = ModelRegistry.getInstance();
        this.hydrator = new Hydrator(this.modelRegistry);
    }

    // Overloads for get method
    async get(): Promise<InternalResponse<T[]>>;
    async get(param: string): Promise<InternalResponse<T>>;
    async get(param: string, singleGetRequestOptions?: RequestOptionsType): Promise<InternalResponse<T>>;
    async get(param: RequestOptionsType): Promise<InternalResponse<T[]>>;
    async get(
        param?: string | RequestOptionsType,
        singleGetRequestOptions?: SingleGetRequestOptionsType
    ): Promise<InternalResponse<T | T[]>> {
        const { requestParam, endpoint } = GetRequestParamHandler.handle(this.endpoint, param, singleGetRequestOptions);
        let resp = await this.client.makeGetRequest(this.endpoint, requestParam);
        resp.data = this.hydrator.hydrateResponse<T>(resp.data as JsonData | JsonData[], resp.included || []);
        return resp;
    }

    async create(model: Model): Promise<InternalResponse<T>> {
        return await this.client.makePostRequest(this.endpoint, {
            data: {
                type: model.type,
                attributes: model.attributes,
            }
        });
    }

}