import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class CustomerAccount extends BaseModel {
    public type: string = 'customer-accounts';

    static relationships: RelationshipDefinition[] = [
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

    constructor(data?: any) {
        super(data);
    }
}
