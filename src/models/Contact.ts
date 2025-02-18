import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class Contact extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'contacts';

    public salutation: string = '';
    public first_name: string = '';
    public last_name: string = '';
    public telephone: string = '';
    public email: string = '';

    jsonApiMapping() {
        return {
            attributes: ['salutation', 'first_name', 'last_name', 'telephone', 'email'],
        };
    }

    static relationships: RelationshipDefinition[] = [
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

    constructor(data?: any) {
        super(data);

        this.salutation = data?.attributes?.salutation ?? data?.salutation ?? '';
        this.first_name = data?.attributes?.first_name ?? data?.first_name ?? '';
        this.last_name = data?.attributes?.last_name ?? data?.last_name ?? '';
        this.telephone = data?.attributes?.telephone ?? data?.telephone ?? '';
        this.email = data?.attributes?.email ?? data?.email ?? '';
    }
}
