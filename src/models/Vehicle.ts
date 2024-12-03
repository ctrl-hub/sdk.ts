import type { Model } from "../types/Model";

type VehicleAttributes = {
    registration: string;
    vin: string;
    description: string;
};

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
        };
    }

    static hydrate(data: any) {
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