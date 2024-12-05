import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class VehicleModel {
    id = '';
    type = 'vehicle-models';
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
        let vehicleModel = new VehicleModel();
        if (data) {
            vehicleModel.id = data.id || '';
            vehicleModel.type = data.type || 'vehicle-models';
            vehicleModel.relationships = data.relationships || {};
            vehicleModel.attributes.name = data.attributes.name || '';
            vehicleModel.meta = data.meta || {};
            vehicleModel.links = data.links || {};
        }
        return vehicleModel;
    }
}
