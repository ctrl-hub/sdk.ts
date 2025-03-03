import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
export declare class FormCategory extends BaseModel {
    type: string;
    name: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
