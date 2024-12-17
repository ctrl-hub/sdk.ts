import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { VehicleSpecification } from '@models/VehicleSpecification';
import { BaseModel } from '@models/BaseModel';

@RegisterModel
export class Vehicle extends BaseModel {
    public type: string = 'vehicles';

    public registration: string = '';
    public vin: string = '';
    public description: string = '';
    public colour: string = '';

    getApiMapping() {
        return {
            attributes: ['registration', 'vin', 'description', 'colour'],
            relationships: {
                specification: 'vehicle-specifications'
            }
        };
    }

    public specification?: VehicleSpecification | string = '';

    static relationships: RelationshipDefinition[] = [
        {
            name: 'specification',
            type: 'single',
            modelType: 'vehicle-specifications'
        }
    ];

    constructor(data?: any) {
        super(data);
        this.registration = data?.attributes?.registration ?? '';
        this.vin = data?.attributes?.vin ?? '';
        this.description = data?.attributes?.description ?? '';
        this.colour = data?.attributes?.colour ?? '';
        this.specification = '';
    }

    static hydrate(data: any): Vehicle {
        return new Vehicle(data);
    }
}
