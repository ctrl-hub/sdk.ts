import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class VehicleModel extends BaseModel {
    type: string;
    name: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
