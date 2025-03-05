import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
export declare class Contact extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    salutation: string;
    first_name: string;
    last_name: string;
    telephone: string;
    email: string;
    jsonApiMapping(): {
        attributes: string[];
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
