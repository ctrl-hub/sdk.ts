import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
};
export declare class VehicleSpecification extends BaseModel {
    type: string;
    emissions: number;
    engine_capacity: string;
    fuel_type: string;
    year: number;
    wheelplan: string;
    documentation: VehicleModelDocumentation[];
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};
