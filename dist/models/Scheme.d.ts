import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
export declare class Scheme extends BaseModel {
    type: string;
    name: string;
    code: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
    };
}
