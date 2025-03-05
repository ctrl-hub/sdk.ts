import type { JsonApiMapping } from '../types/JsonApiMapping';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
};
export declare class VehicleSpecification extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    emissions: number;
    engine_capacity: string;
    fuel_type: string;
    year: number;
    wheelplan: string;
    documentation: VehicleModelDocumentation[];
    jsonApiMapping(): {
        attributes: string[];
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};
