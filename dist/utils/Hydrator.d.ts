import type { Model } from "../types/Model";
import type { Service } from "../types/Service";
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
export declare class Hydrator {
    private services;
    constructor(services: Record<string, any>);
    hydrateResponse(service: Service, response: any): any;
    hydrateJson(json: JsonData): Model | null;
    hydrateRelationships(single: JsonData, included: JsonData[]): JsonData;
    populateModelAttributes(model: any, json: any): void;
    findServiceModel(type: string): any;
    findMatchingIncluded(relation: any, included: any[]): any;
}
export {};
//# sourceMappingURL=Hydrator.d.ts.map