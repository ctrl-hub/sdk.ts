import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
export declare class Submission extends BaseModel {
    type: string;
    reference: string;
    status: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
