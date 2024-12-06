import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';

type VehicleModelAttributes = {
    name: string;
    specification: VehicleModelSpecification;
    documentation: VehicleModelDocumentation[];
};

type VehicleModelSpecification = {
    emissions: string;
    transmission: string;
}

type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

@RegisterModel
export class VehicleModel implements Model {
    public id: string = '';
    public type: string = 'vehicle-models';
    public attributes: VehicleModelAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;

    constructor() {
        this.attributes = {
            name: '',
            specification: {
                emissions: '',
                transmission: ''
            },
            documentation: [],
        };
    }

    static hydrate(data: any) {
        let vehicleModel = new VehicleModel();

        if (data) {
            vehicleModel.id = data.id || '';
            vehicleModel.type = data.type || 'vehicle-models';
            vehicleModel.relationships = data.relationships || {};
            vehicleModel.attributes.name = data.attributes.name || '';
            vehicleModel.attributes.specification.emissions = data.attributes.specification.emissions || '';
            vehicleModel.attributes.specification.transmission = data.attributes.specification.transmission || '';
            vehicleModel.attributes.documentation = data.attributes.documentation || [];
            vehicleModel.meta = data.meta || {};
            vehicleModel.links = data.links || {};
        }

        return vehicleModel;
    }
}
