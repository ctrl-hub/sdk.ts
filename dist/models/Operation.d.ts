import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { Label } from './Label';
export declare class Operation extends BaseModel {
    type: string;
    name: string;
    code: string;
    description: string;
    start_date: string;
    end_date: string;
    labels: Array<Label>;
    uprns: Array<number>;
    usrns: Array<number>;
    completed: boolean;
    aborted: boolean;
    cancelled: boolean;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    jsonApiMapping(): {
        attributes: string[];
    };
}
