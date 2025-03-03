import { BaseModel } from './BaseModel';
export class Customer extends BaseModel {
    type = 'customers';
    name = '';
    telephone = '';
    email = '';
    property = '';
    jsonApiMapping() {
        return {
            attributes: ['name', 'telephone', 'email', 'property'],
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
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.telephone = data?.attributes?.telephone ?? data?.telephone ?? '';
        this.email = data?.attributes?.email ?? data?.email ?? '';
        this.property = data?.attributes?.property ?? data?.property ?? '';
    }
}
