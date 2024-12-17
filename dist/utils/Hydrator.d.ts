import type { JsonData } from '../types/Response';
import type { Model } from '../types/Model';
export declare class Hydrator {
    private modelMap;
    hydrateResponse<T extends Model>(data: JsonData | JsonData[], included: any[]): T | T[];
    private hydrateArray;
    private hydrateSingle;
    private hydrateRelationships;
    private findAndHydrateIncluded;
}
