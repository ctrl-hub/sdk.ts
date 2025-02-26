import { BaseModel } from '@models/BaseModel';
export class CustomerAccount extends BaseModel {
    type = 'customer-accounts';
    static relationships = [
        {
            name: 'properties',
            type: 'array',
            modelType: 'properties',
        },
        {
            name: 'contacts',
            type: 'array',
            modelType: 'contacts',
        },
        {
            name: 'interactions',
            type: 'array',
            modelType: 'customer-interactions',
        },
    ];
    constructor(data) {
        super(data);
    }
    jsonApiMapping() {
        return {
            relationships: ['contacts', 'properties'],
        };
    }
}
