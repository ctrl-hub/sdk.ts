import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class Role extends BaseModel {
    type: string;
    custom: boolean;
    name: string;
    description: string;
    launch_stage: string;
    permissions: string[];
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
