import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import { VehicleModel } from '@models/VehicleModel';
type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
};
export declare class VehicleSpecification extends BaseModel {
    type: string;
    emissions: number;
    engine: string;
    fuel: string;
    transmission: string;
    year: number;
    documentation: VehicleModelDocumentation[];
    model: VehicleModel;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};
