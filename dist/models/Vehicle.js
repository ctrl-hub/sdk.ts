import { RegisterModel } from '../utils/ModelRegistry';
import { VehicleSpecification } from '@models/VehicleSpecification';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class Vehicle extends BaseModel {
    type = 'vehicles';
    registration = '';
    vin = '';
    description = '';
    colour = '';
    getApiMapping() {
        return {
            attributes: ['registration', 'vin', 'description', 'colour'],
            relationships: {
                specification: 'vehicle-specifications'
            }
        };
    }
    specification = '';
    static relationships = [
        {
            name: 'specification',
            type: 'single',
            modelType: 'vehicle-specifications'
        }
    ];
    constructor(data) {
        super(data);
        this.registration = data?.attributes?.registration ?? '';
        this.vin = data?.attributes?.vin ?? '';
        this.description = data?.attributes?.description ?? '';
        this.colour = data?.attributes?.colour ?? '';
        this.specification = '';
    }
    static hydrate(data) {
        return new Vehicle(data);
    }
}
