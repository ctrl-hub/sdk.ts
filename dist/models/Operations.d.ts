import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
export declare class WorkOrder extends BaseModel {
    type: string;
    name: string;
    code: string;
    description: string;
    status: string;
    start_date: string;
    end_date: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
    };
}
