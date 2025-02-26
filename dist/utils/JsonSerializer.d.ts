import type { Model } from '../types/Model';
import type { JsonApiMapping } from '../types/JsonApiMapping';
type JsonApiRelationship = {
    data: {
        type: string;
        id: string;
    };
};
type JsonApiRelationshipsPayload = {
    data: Array<{
        type: string;
        id: string;
    }>;
};
type JsonApiPayload = {
    data: {
        id?: string;
        type: string;
        attributes: Record<string, any>;
        relationships?: Record<string, JsonApiRelationship>;
    };
};
export declare class JsonApiSerializer {
    protected modelMap: Record<string, new (...args: any[]) => Model>;
    constructor(modelMap: Record<string, new (...args: any[]) => Model>);
    buildCreatePayload(model: Model & Partial<JsonApiMapping>): JsonApiPayload;
    buildUpdatePayload(model: Model & Partial<JsonApiMapping>): JsonApiPayload;
    private buildPayload;
    buildRelationshipPayload(model: Model, relationships: Array<Model>): JsonApiRelationshipsPayload;
    private buildDefaultPayload;
}
export {};
