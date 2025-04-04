import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { VehicleSpecification } from '@models/VehicleSpecification';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class Vehicle extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'vehicles';

    public registration: string = '';
    public vin: string = '';
    public description: string = '';
    public colour: string = '';

    public specification?: VehicleSpecification | string = '';
    public status?: string = '';

    jsonApiMapping() {
        return {
            attributes: ['registration', 'vin', 'description', 'colour', 'status'],
            relationships: {
                specification: 'vehicle-specifications',
            },
        };
    }

    static relationships: RelationshipDefinition[] = [
        {
            name: 'specification',
            type: 'single',
            modelType: 'vehicle-specifications',
        },
        {
            name: 'assignee',
            type: 'single',
            modelType: 'users',
        },
        {
            name: 'equipment',
            type: 'array',
            modelType: 'equipment',
        },
        {
            name: 'team',
            type: 'single',
            modelType: 'teams',
        },
    ];

    constructor(data?: any) {
        super(data);
        this.registration = data?.attributes?.registration ?? data?.registration ?? '';
        this.vin = data?.attributes?.vin ?? data?.vin ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.colour = data?.attributes?.colour ?? data?.colour ?? '';
        this.specification = data?.relationships?.specification?.id ?? data?.specification ?? '';
        this.status = data?.attributes?.status ?? data?.status ?? '';
    }
}
