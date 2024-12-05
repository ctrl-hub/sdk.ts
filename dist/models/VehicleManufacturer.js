import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class VehicleManufacturer {
    id = '';
    type = 'vehicle-manufacturers';
    attributes;
    meta = {};
    links = {};
    relationships;
    constructor() {
        this.attributes = {
            name: '',
        };
    }
    static hydrate(data) {
        let vehicleManufacturer = new VehicleManufacturer();
        if (data) {
            vehicleManufacturer.id = data.id || '';
            vehicleManufacturer.type = data.type || 'vehicle-manufacturers';
            vehicleManufacturer.relationships = data.relationships || {};
            vehicleManufacturer.attributes.name = data.attributes.name || '';
            vehicleManufacturer.meta = data.meta || {};
            vehicleManufacturer.links = data.links || {};
        }
        return vehicleManufacturer;
    }
}
