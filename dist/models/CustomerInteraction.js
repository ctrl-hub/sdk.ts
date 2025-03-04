import { BaseModel } from './BaseModel';
export class CustomerInteraction extends BaseModel {
    type = 'customer-interactions';
    method;
    direction;
    date_time = '';
    contacted = false;
    status = '';
    notes = '';
    representative;
    property;
    contact;
    customer_account;
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
    static relationships = [
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
    constructor(data) {
        super(data);
        this.method = data?.attributes?.method ?? data?.method ?? '';
        this.direction = data?.attributes?.direction ?? data?.direction ?? '';
        this.date_time = data?.attributes?.date_time ?? data?.date_time ?? '';
        this.contacted = data?.attributes?.contacted ?? data?.contacted ?? false;
        this.status = data?.attributes?.status ?? data?.status ?? '';
        this.notes = data?.attributes?.notes ?? data?.notes ?? '';
    }
}
