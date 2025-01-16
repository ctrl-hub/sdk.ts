import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
interface Item {
    'equipment_id': string;
    'present'?: boolean;
    'working'?: boolean;
    'cerified'?: boolean;
}
export declare class VehicleInventoryCheck extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    inspected_at: string;
    items?: Item[];
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            specification: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};
