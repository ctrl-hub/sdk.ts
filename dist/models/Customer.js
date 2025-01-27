import { BaseModel } from '@models/BaseModel';
export class Customer extends BaseModel {
    type = 'customers';
    name = '';
    telephone = '';
    email = '';
    jsonApiMapping() {
        return {
            attributes: ['name', 'telephone', 'email'],
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
    ];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.telephone = data?.attributes?.telephone ?? data?.telephone ?? '';
        this.email = data?.attributes?.email ?? data?.email ?? '';
    }
}
