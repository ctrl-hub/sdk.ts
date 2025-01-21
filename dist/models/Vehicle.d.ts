import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { VehicleSpecification } from '@models/VehicleSpecification';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
import type { VehicleStatus } from './VehicleStatus';
export declare class Vehicle extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    registration: string;
    vin: string;
    description: string;
    colour: string;
    specification?: VehicleSpecification | string;
    status?: VehicleStatus | string;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            specification: string;
            status: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
