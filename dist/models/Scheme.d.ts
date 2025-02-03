import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { Label } from './Label';
export declare class Scheme extends BaseModel {
    type: string;
    name: string;
    code: string;
    description: string;
    status: string;
    start_date: string;
    end_date: string;
    labels: Array<Label>;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
    };
}
