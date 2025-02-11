import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
import type { User } from './User';
export declare class CustomerInteraction extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    method: 'letter' | 'email' | 'telephone' | 'sms';
    direction: 'inbound' | 'outbound';
    date_time: string;
    contacted: boolean;
    status: string;
    notes: string;
    representative?: User;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            representative: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
