import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';
import { VehicleManufacturer } from "./VehicleManufacturer";
import { VehicleModel } from "./VehicleModel";

type VehicleAttributes = {
    registration: string;
    vin: string;
    description: string;
    colour: string;
    manufacturer: object;
    model: object;
};

@RegisterModel
export class Vehicle implements Model {
    public id: string = '';
    public type: string = 'vehicles';
    public attributes: VehicleAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;

    constructor() {
        this.attributes = {
            registration: '',
            vin: '',
            description: '',
            colour: '',
            manufacturer: {
                id: '',
                type: '',
                attributes: {
                    name: ''
                },
            },
            model: {
                id: '',
                type: '',
                attributes: {
                    name: ''
                },
            }
        };
    }

    static hydrate(data: any) {
        let vehicle = new Vehicle();

        if (data) {
            vehicle.id = data.id || '';
            vehicle.type = data.type || 'vehicles';
            vehicle.relationships = data.relationships || {};
            vehicle.attributes.registration = data.attributes.registration || '';
            vehicle.attributes.vin = data.attributes.vin || '';
            vehicle.attributes.description = data.attributes.description || '';
            vehicle.attributes.colour = data.attributes.colour || '';
            vehicle.attributes.manufacturer = data.attributes.manufacturer || '';
            vehicle.attributes.model = data.attributes.model || '';
            vehicle.meta = data.meta || {};
            vehicle.links = data.links || {};
        }

        return vehicle;
    }
}
