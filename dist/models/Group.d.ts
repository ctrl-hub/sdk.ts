import type { JsonApiMapping } from '../types/JsonApiMapping';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
type Binding = {
    id: string;
    role: string;
    condition: {
        gate: 'AND' | 'OR';
        rules: {
            type: string;
            operator: string;
            value: string;
        }[];
    };
};
export declare class Group extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    name: string;
    description: string;
    bindings: Binding[];
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
        relationships: {};
    };
}
export {};
