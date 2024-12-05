import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Vehicle {
    id = '';
    type = 'vehicles';
    attributes;
    meta = {};
    links = {};
    relationships;
    constructor() {
        this.attributes = {
            registration: '',
            vin: '',
            description: '',
            colour: '',
        };
        this.relationships = {
            manufacturer: {
                data: {
                    id: '',
                    type: 'vehicle-manufacturers',
                }
            },
            model: {
                data: {
                    id: '',
                    type: 'vehicle-models',
                }
            },
        };
    }
    static hydrate(data) {
        let vehicle = new Vehicle();
        if (data) {
            vehicle.id = data.id || '';
            vehicle.type = data.type || 'vehicles';
            vehicle.attributes.registration = data.attributes.registration || '';
            vehicle.attributes.vin = data.attributes.vin || '';
            vehicle.attributes.description = data.attributes.description || '';
            vehicle.attributes.colour = data.attributes.colour || '';
            vehicle.relationships.manufacturer.data.id = data.relationships.manufacturer?.data?.id || '';
            vehicle.relationships.model.data.id = data.relationships.model.data.id || '';
            vehicle.meta = data.meta || {};
            vehicle.links = data.links || {};
        }
        return vehicle;
    }
}
