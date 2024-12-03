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
            vehicle.attributes.registration = vehicle.relationships.author?.data?.id || '';
            vehicle.attributes.vin = vehicle.relationships.form?.data?.id || '';
            vehicle.attributes.description = vehicle.relationships.form_version?.data?.id || '';
            vehicle.meta = data.meta || {};
            vehicle.links = data.links || {};
        }
        return vehicle;
    }
}
