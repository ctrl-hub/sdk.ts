import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';
import { VehicleManufacturer } from "./VehicleManufacturer";
import { VehicleModel } from "./VehicleModel";

type VehicleAttributes = {
    registration: string;
    vin: string;
    description: string;
    colour: string;
};

type VehicleRelationships = {
    model: {
        id: string;
        type: string;
    },
    manufacturer: {
        id: string;
        type: string;
    },
}

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
        }
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

    static hydrate(data: any) {
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
