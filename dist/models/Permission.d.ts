import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
export declare class Permission extends BaseModel {
    type: string;
    description: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
