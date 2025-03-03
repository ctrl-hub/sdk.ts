import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from './BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
import type { User } from './User';
import type { Property } from './Property';
import type { Contact } from './Contact';
import type { CustomerAccount } from './CustomerAccount';
export declare class CustomerInteraction extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    method: 'letter' | 'email' | 'telephone' | 'sms';
    direction: 'inbound' | 'outbound';
    date_time: string;
    contacted: boolean;
    status: string;
    notes: string;
    representative?: User;
    property?: Property;
    contact?: Contact;
    customer_account?: CustomerAccount;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            representative: string;
            property: string;
            contact: string;
            customer_account: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
