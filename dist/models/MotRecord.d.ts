import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
interface Defect {
    'dangerous': boolean;
    'text': string;
    'type': string;
}
interface Odometer {
    'type': string;
    'unit': string;
    'value': number;
}
export declare class MotRecord extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    completedDate: string;
    dataSource: string;
    defects?: Defect[];
    expiryDate: string;
    odometer: Odometer;
    result: string;
    jsonApiMapping(): {};
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};
