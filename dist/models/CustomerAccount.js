import { BaseModel } from '@models/BaseModel';
export class CustomerAccount extends BaseModel {
    type = 'customer-accounts';
    property = '';
    jsonApiMapping() {
        return {
            attributes: ['property'],
        };
    }
    static relationships = [
        {
            name: 'properties',
            type: 'array',
            modelType: 'properties',
        },
    ];
    constructor(data) {
        super(data);
        this.property = data?.attributes?.property ?? data?.property ?? '';
    }
}
