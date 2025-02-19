import { BaseModel } from '@models/BaseModel';
export class Contact extends BaseModel {
    type = 'contacts';
    salutation = '';
    first_name = '';
    last_name = '';
    telephone = '';
    email = '';
    jsonApiMapping() {
        return {
            attributes: ['salutation', 'first_name', 'last_name', 'telephone', 'email'],
        };
    }
    static relationships = [
        {
            name: 'customer_accounts',
            type: 'array',
            modelType: 'customer-accounts',
        },
        {
            name: 'representative',
            type: 'array',
            modelType: 'customer-interactions',
        },
        {
            name: 'properties',
            type: 'array',
            modelType: 'properties',
        },
    ];
    constructor(data) {
        super(data);
        this.salutation = data?.attributes?.salutation ?? data?.salutation ?? '';
        this.first_name = data?.attributes?.first_name ?? data?.first_name ?? '';
        this.last_name = data?.attributes?.last_name ?? data?.last_name ?? '';
        this.telephone = data?.attributes?.telephone ?? data?.telephone ?? '';
        this.email = data?.attributes?.email ?? data?.email ?? '';
    }
}
