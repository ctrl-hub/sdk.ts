import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { Label } from './Label';
export declare class WorkOrder extends BaseModel {
    type: string;
    name: string;
    code: string;
    description: string;
    status: string;
    start_date: string;
    end_date: string;
    labels: Array<Label>;
    uprns: Array<number>;
    usrns: Array<number>;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
    };
}
