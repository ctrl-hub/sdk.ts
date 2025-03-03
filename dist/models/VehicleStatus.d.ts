import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
export declare class VehicleStatus extends BaseModel {
    type: string;
    name: string;
    jsonApiMapping(): {};
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
