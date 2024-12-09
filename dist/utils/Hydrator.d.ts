import { ModelRegistry } from './ModelRegistry';
import type { JsonData } from '../types/Response';
export declare class Hydrator {
    private modelRegistry;
    constructor(modelRegistry: ModelRegistry);
    hydrateResponse<T>(data: JsonData | JsonData[], included: any[]): T | T[];
    private hydrateArray;
    private hydrateSingle;
    private hydrateRelationships;
    private findMatchingIncluded;
}
