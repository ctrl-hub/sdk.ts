import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class Customer extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'customers';

    public name: string = '';
    public telephone: string = '';
    public email: string = '';

    jsonApiMapping() {
        return {
            attributes: ['name', 'telephone', 'email'],
            relationships: {
                model: 'customer-interactions',
            },
        };
    }

    static relationships: RelationshipDefinition[] = [
        {
            name: 'model',
            type: 'array',
            modelType: 'customer-interactions',
        },
    ];

    constructor(data?: any) {
        super(data);

        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.telephone = data?.attributes?.telephone ?? data?.telephone ?? '';
        this.email = data?.attributes?.email ?? data?.email ?? '';
    }
}
