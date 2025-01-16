import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
export declare class User extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    firstName: string;
    lastName: string;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            specification: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
