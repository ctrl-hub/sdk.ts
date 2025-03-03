import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
type FieldMapping = {
    from: string;
    to: string;
};
export declare class Form extends BaseModel {
    type: string;
    name: string;
    description: string;
    fieldMappings: FieldMapping[];
    status: string;
    formType: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};
