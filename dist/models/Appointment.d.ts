import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
export declare class Appointment extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    appointment_type: string;
    start_time: string;
    end_time: string;
    notes: string;
    jsonApiMapping(): {
        attributes: string[];
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
