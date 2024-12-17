import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class SubmissionVersion extends BaseModel {
    type: string;
    author: string;
    form: string;
    form_version: string;
    reference: string;
    status: string;
    content: object;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
