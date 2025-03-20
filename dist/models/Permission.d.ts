import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
export declare class Permission extends BaseModel {
    type: string;
    name: string;
    description: string;
    category: string;
    component: string;
    verb: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
