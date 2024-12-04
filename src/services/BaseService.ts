import { Client } from "../Client";
import { InternalResponse } from "../types/Response";
import {RequestOptions, RequestOptionsType} from "../utils/RequestOptions";
import {ModelConstructor} from "../types/ModelConstructor";
import { Form } from "../models/Form"
import { FormCategory } from "../models/FormCategory";
import { Role } from "../models/Role";
import { ServiceAccount } from "../models/ServiceAccount";
import { ServiceAccountKey } from "../models/ServiceAccountKey";
import { Submission } from "../models/Submission";
import {Permission} from "../models/Permission";

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
    protected hydrateFunction: (data: any, options: any) => T;
    public services: Record<string, any> = {};
    public models: Record<string, any> = {};

    constructor(client: Client, endpoint: string, hydrateFunction: (data: any, options: any) => T) {
        this.client = client;
        this.endpoint = endpoint;
        this.hydrateFunction = hydrateFunction;

        this.models["form-categories"] = FormCategory as ModelConstructor<FormCategory>;
        this.models["forms"] = Form as ModelConstructor<Form>;
        this.models["submissions"] = Submission as ModelConstructor<Submission>;
        this.models["permissions"] = Permission as ModelConstructor<Permission>;
        this.models["roles"] = Role as ModelConstructor<Role>;
        this.models["service-accounts"] = ServiceAccount as ModelConstructor<ServiceAccount>;
        this.models["service-account-keys"] = ServiceAccountKey as ModelConstructor<ServiceAccountKey>;
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

        // hydrate the model(s) in resp.data
        // hydrate model relationships from the data in resp.includes
        resp.data = Array.isArray(resp.data)
            ? this.hydrateDataArray(resp.data, resp.included)
            : this.hydrateSingleItem(resp.data, resp.included);

        return resp;
    }

    private hydrateModel(item: JsonData): JsonData & T {
        return this.hydrateFunction(item, null) as JsonData & T;
    }

    private hydrateDataArray(items: JsonData[], included: any[]): (JsonData & T)[] {
        return items
            .map(item => this.hydrateModel(item))
            .map(item => this.hydrateRelationships(item, included) as JsonData & T);
    }

    private hydrateSingleItem(item: JsonData, included: any[]): JsonData & T {
        const hydrated = this.hydrateModel(item);
        return this.hydrateRelationships(hydrated, included) as JsonData & T;
    }

    hydrateRelationships(single: JsonData, included: any[]): JsonData {
        if (!single.relationships || !included) return single;

        Object.entries(single.relationships).forEach(([key, relationship]) => {
            const { data } = relationship;

            // Hydrate arrays or single items from included data
            relationship.data = Array.isArray(data)
                ? data.map(relation => this.findMatchingIncluded(relation, included) || relation)
                : this.findMatchingIncluded(data, included) || data;
        });

        return single;
    }

    findMatchingIncluded(relation: any, included: any[]) {
        return included?.find(inc => inc.id === relation.id && inc.type === relation.type);
    }
}