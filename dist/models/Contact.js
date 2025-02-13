import { BaseModel } from '@models/BaseModel';
export class Contact extends BaseModel {
    type = 'contact';
    first_name = '';
    last_name = '';
    telephone = '';
    email = '';
    property = '';
    jsonApiMapping() {
        return {
            attributes: ['first_name', 'last_name', 'telephone', 'email', 'property'],
            relationships: {
                model: 'customer-interactions',
            },
        };
    }
    static relationships = [
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
        this.first_name = data?.attributes?.first_name ?? data?.first_name ?? '';
        this.last_name = data?.attributes?.last_name ?? data?.last_name ?? '';
        this.telephone = data?.attributes?.telephone ?? data?.telephone ?? '';
        this.email = data?.attributes?.email ?? data?.email ?? '';
        this.property = data?.attributes?.property ?? data?.property ?? '';
    }
}
