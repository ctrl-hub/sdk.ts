import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class FormVersion extends BaseModel {
    type: string;
    name: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
