import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
import type { Label } from './Label';
type Requirements = {
    forms: FormRequirement[];
};
declare class FormRequirement {
    id: string;
    required: boolean;
}
export declare class OperationTemplate extends BaseModel {
    type: string;
    name: string;
    labels: Label[];
    requirements: Requirements;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
    };
}
export {};
