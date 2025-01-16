import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

interface Item {
    'equipment_id': string,
    'present'?: boolean,
    'working'?: boolean,
    'cerified'?: boolean
}

export class VehicleInventoryCheck extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'vehicle-inventory-checks';

    public inspected_at: string = '';

    public items?: Item[] = [];

    jsonApiMapping() {
        return {
            attributes: ['registration', 'vin', 'description', 'colour'],
            relationships: {
                specification: 'vehicle-specifications',
            },
        };
    }

    static relationships: RelationshipDefinition[] = [
        {
            name: 'equipment',
            type: 'array',
            modelType: 'equipment-items',
        },
        {
            name: 'author',
            type: 'single',
            modelType: 'users',
        },
    ];

    constructor(data?: any) {
        super(data);
        this.inspected_at = data?.attributes?.inspected_at ?? data?.inspected_at ?? '';
        this.items = data?.attributes?.items ?? [];
    }
}
