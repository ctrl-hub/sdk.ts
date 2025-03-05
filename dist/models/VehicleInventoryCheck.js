import { BaseModel } from './BaseModel';
export class VehicleInventoryCheck extends BaseModel {
    type = 'vehicle-inventory-checks';
    inspected_at = '';
    items = [];
    jsonApiMapping() {
        return {
            attributes: ['registration', 'vin', 'description', 'colour'],
            relationships: {
                author: 'author',
                vehicle: 'vehicle',
            },
        };
    }
    static relationships = [
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
        {
            name: 'vehicle',
            type: 'single',
            modelType: 'vehicles',
        },
    ];
    constructor(data) {
        super(data);
        this.inspected_at = data?.attributes?.inspected_at ?? data?.inspected_at ?? '';
        this.items = data?.attributes?.items ?? [];
    }
}
