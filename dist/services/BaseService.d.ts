import { Client } from "../Client";
import { InternalResponse } from "../types/Response";
import { RequestOptionsType } from "../utils/RequestOptions";
interface JsonData {
    id: string;
    type: string;
    attributes?: Record<string, any>;
    relationships?: Record<string, {
        data: any[];
    }>;
    meta?: Record<string, any>;
    links?: string[];
}
export declare class BaseService<T> {
    protected client: Client;
    protected endpoint: string;
    protected hydrateFunction: (data: any, options: any) => T;
    services: Record<string, any>;
    models: Record<string, any>;
    constructor(client: Client, endpoint: string, hydrateFunction: (data: any, options: any) => T);
    get(): Promise<InternalResponse<T[]>>;
    get(param: string): Promise<InternalResponse<T>>;
    get(param: RequestOptionsType): Promise<InternalResponse<T[]>>;
    hydrateRelationships(single: JsonData, included: any[]): JsonData;
    findMatchingIncluded(relation: any, included: any[]): any;
}
export {};
