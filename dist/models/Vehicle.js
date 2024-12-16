import { RegisterModel } from '../utils/ModelRegistry';
import { VehicleSpecification } from '@models/VehicleSpecification';
@RegisterModel
export class Vehicle {
    id = '';
    type = 'vehicles';
    meta = {};
    links = {};
    _relationships;
    included;
    registration = '';
    vin = '';
    description = '';
    colour = '';
    specification;
    static relationships = [
        {
            name: 'model',
            type: 'single',
            modelType: 'vehicle-models'
        },
        {
            name: 'specification',
            type: 'single',
            modelType: 'vehicle-specifications'
        }
    ];
    constructor(data) {
        this.id = data?.id ?? '';
        this.registration = data?.attributes?.registration ?? '';
        this.vin = data?.attributes?.vin ?? '';
        this.description = data?.attributes?.description ?? '';
        this.colour = data?.attributes?.colour ?? '';
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Vehicle(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
