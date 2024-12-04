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

        const dataIsArray = Array.isArray(resp.data);

        // Hydrate response based on whether it's a single item or an array
        if (dataIsArray) {
            resp.data = resp.data.map((item: any) => this.hydrateFunction(item, null));
        } else {
            resp.data = this.hydrateFunction(resp.data, null);
        }

        // Hydrate relationships
        if (dataIsArray) {
            resp.data = resp.data.map((single: any) => this.hydrateRelationships(single, resp.included));
        } else {
            resp.data = this.hydrateRelationships(resp.data, resp.included);
        }

        return resp;
    }

    hydrateRelationships(single: JsonData, included: any[]): JsonData {
        if (!single.relationships) return single;

        Object.entries(single.relationships).forEach(([key, relationship]) => {
            const { data } = relationship;

            // relationship[key] could be array or single object
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