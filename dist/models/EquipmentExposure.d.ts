import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
type Location = {
    type: "Point";
    coordinates: [number, number];
};
type PPE = {
    mask: boolean;
    ear_defenders: boolean;
};
export declare class EquipmentExposure extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    start_time: string;
    end_time: string;
    location: Location;
    ppe: PPE;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            author: string;
            equipment: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};
