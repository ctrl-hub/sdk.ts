import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';

type VehicleManufacturerAttributes = {
    name: string;
};

@RegisterModel
export class VehicleManufacturer implements Model {
    public id: string = '';
    public type: string = 'vehicle-manufacturers';
    public attributes: VehicleManufacturerAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;

    constructor() {
        this.attributes = {
            name: '',
        };
    }

    static hydrate(data: any) {
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
