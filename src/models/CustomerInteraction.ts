import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
import type { User } from './User';
import type { Property } from './Property';
import type { Contact } from './Contact';
import type { CustomerAccount } from './CustomerAccount';

export class CustomerInteraction extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'customer-interactions';

    public method: 'letter' | 'email' | 'telephone' | 'sms';
    public direction: 'inbound' | 'outbound';
    public date_time: string = '';
    public contacted: boolean = false;
    public status: string = '';
    public notes: string = '';

    public representative?: User;
    public property?: Property;
    public contact?: Contact;
    public customer_account?: CustomerAccount;

    jsonApiMapping() {
        return {
            attributes: ['method', 'direction', 'date_time', 'contacted', 'status', 'notes'],
            relationships: {
                representative: 'users',
                property: 'properties',
                contact: 'contacts',
                customer_account: 'customer-accounts',
            },
        };
    }

    static relationships: RelationshipDefinition[] = [
        {
            name: 'representative',
            type: 'single',
            modelType: 'users',
        },
        {
            name: 'property',
            type: 'single',
            modelType: 'properties',
        },
        {
            name: 'contact',
            type: 'single',
            modelType: 'contacts',
        },
        {
            name: 'customer_account',
            type: 'single',
            modelType: 'customer-accounts',
        },
    ];

    constructor(data?: any) {
        super(data);

        this.method = data?.attributes?.method ?? data?.method ?? '';
        this.direction = data?.attributes?.direction ?? data?.direction ?? '';
        this.date_time = data?.attributes?.date_time ?? data?.date_time ?? '';
        this.contacted = data?.attributes?.contacted ?? data?.contacted ?? false;
        this.status = data?.attributes?.status ?? data?.status ?? '';
        this.notes = data?.attributes?.notes ?? data?.notes ?? '';
    }
}
