import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class CustomerAccount extends BaseModel {
    type: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
