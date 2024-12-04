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
        };
    }
    static hydrate(data) {
        let vehicle = new Vehicle();
        if (data) {
            vehicle.id = data.id || '';
            vehicle.type = data.type || 'vehicles';
            vehicle.relationships = data.relationships || {};
            vehicle.attributes.registration = data.attributes.registration || '';
            vehicle.attributes.vin = data.attributes.vin || '';
            vehicle.attributes.description = data.attributes.description || '';
            vehicle.meta = data.meta || {};
            vehicle.links = data.links || {};
        }
        return vehicle;
    }
}