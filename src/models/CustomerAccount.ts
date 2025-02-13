import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class CustomerAccount extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'customer-accounts';

    public property: string = '';

    jsonApiMapping() {
        return {
            attributes: ['property'],
        };
    }

    static relationships: RelationshipDefinition[] = [
        {
            name: 'properties',
            type: 'array',
            modelType: 'properties',
        },
    ];

    constructor(data?: any) {
        super(data);

        this.property = data?.attributes?.property ?? data?.property ?? '';
    }
}
