import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
type VehicleCategory = {
    id: string;
    name: string;
};
export declare class VehicleModel extends BaseModel {
    type: string;
    name: string;
    categories: VehicleCategory[];
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};
