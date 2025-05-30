import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
import type { Label } from './Label';
export declare class SchemeTemplate extends BaseModel {
    type: string;
    name: string;
    labels: Label[];
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
    };
}
