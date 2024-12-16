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
    specification;
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
    }
    static hydrate(data) {
        return new Vehicle(data);
    }
}
