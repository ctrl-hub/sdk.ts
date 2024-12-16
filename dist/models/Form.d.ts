import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
type FieldMapping = {
    from: string;
    to: string;
};
export declare class Form extends BaseModel {
    type: string;
    name: string;
    description: string;
    field_mappings: FieldMapping[];
    status: string;
    formType: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): Form;
}
export {};
