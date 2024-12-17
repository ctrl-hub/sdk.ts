import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { VehicleSpecification } from '@models/VehicleSpecification';
import { BaseModel } from '@models/BaseModel';
export declare class Vehicle extends BaseModel {
    type: string;
    registration: string;
    vin: string;
    description: string;
    colour: string;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            specification: string;
        };
    };
    specification?: VehicleSpecification | string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
