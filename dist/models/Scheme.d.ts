import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
export declare class Scheme extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    name: string;
    code: string;
    description: string;
    status: string;
    start_date?: Date;
    end_date?: Date;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
        attributeCasts: {
            start_date: string;
            end_date: string;
        };
    };
}
