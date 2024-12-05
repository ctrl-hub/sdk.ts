import { Client } from "../Client";
import { InternalResponse } from "../types/Response";
import { RequestOptions, RequestOptionsType } from "../utils/RequestOptions";
import { ModelRegistry } from "../utils/ModelRegistry";
import { Hydrator } from "../utils/Hydrator";
import { Model } from "types/Model";

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
    async get(param: RequestOptionsType): Promise<InternalResponse<T[]>>;
    async get(param?: string | RequestOptionsType): Promise<InternalResponse<T | T[]>> {
        // Make the request and type the response
        let endpoint = this.client.finalEndpoint(this.endpoint);

        let requestParam: string | RequestOptions | undefined;

        if (typeof param === 'string') {
            requestParam = param;
        } else if (typeof param === 'object') {
            // If param is an object, convert it to RequestOptions
            requestParam = new RequestOptions(param);
        }

        let resp = await this.client.makeGetRequest(endpoint, requestParam);
        resp.data = this.hydrator.hydrateResponse<T>(resp.data as JsonData | JsonData[], resp.included || []);
        return resp;
    }

    async create(model: Model): Promise<InternalResponse<T>> {
        let createEndpoint = this.client.finalEndpoint(this.endpoint);
        return await this.client.makePostRequest(createEndpoint, {
            data: {
                type: model.type,
                attributes: model.attributes,
            }
        });
    }

}