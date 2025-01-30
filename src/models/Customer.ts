import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class Customer extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'customers';

    public name: string = '';
    public telephone: string = '';
    public email: string = '';
    public property: string = '';

    jsonApiMapping() {
        return {
            attributes: ['name', 'telephone', 'email', 'property'],
            relationships: {
                model: 'customer-interactions',
            },
        };
    }

    static relationships: RelationshipDefinition[] = [
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

        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.telephone = data?.attributes?.telephone ?? data?.telephone ?? '';
        this.email = data?.attributes?.email ?? data?.email ?? '';
        this.property = data?.attributes?.property ?? data?.property ?? '';
    }
}
