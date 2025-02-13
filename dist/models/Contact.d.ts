import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
export declare class Contact extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    first_name: string;
    last_name: string;
    telephone: string;
    email: string;
    property: string;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            model: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
