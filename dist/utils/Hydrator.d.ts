import { ModelRegistry } from './ModelRegistry';
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
    private modelRegistry;
    constructor(modelRegistry: ModelRegistry);
    hydrateResponse<T>(data: JsonData | JsonData[], included: any[]): T | T[];
    private hydrateArray;
    private hydrateSingle;
    private hydrateRelationships;
    private findMatchingIncluded;
}
export {};
