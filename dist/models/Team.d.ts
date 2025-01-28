import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
export declare class Team extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    name: string;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            members: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
