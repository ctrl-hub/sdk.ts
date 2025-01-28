import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { VehicleSpecification } from '@models/VehicleSpecification';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
export declare class Vehicle extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    registration: string;
    vin: string;
    description: string;
    colour: string;
    specification?: VehicleSpecification | string;
    status?: string;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            specification: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
