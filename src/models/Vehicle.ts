import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';
import type { Relationship } from "types/Relationship";

type VehicleAttributes = {
    registration: string;
    vin: string;
    description: string;
    colour: string;
};

type VehicleRelationships = {
    manufacturer: Relationship;
    model: Relationship;
    specification: Relationship;
}

@RegisterModel
export class Vehicle implements Model {
    public id: string = '';
    public type: string = 'vehicles';
    public attributes: VehicleAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: VehicleRelationships;
    public included?: any;

    constructor(data?: Vehicle) {
        this.id = data?.id ?? '';
        this.attributes = {
            registration: data?.attributes?.registration ?? '',
            vin: data?.attributes?.vin ?? '',
            description: data?.attributes?.description ?? '',
            colour: data?.attributes?.colour ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = {
            manufacturer: {
                data: {
                    id: data?.relationships?.manufacturer?.data?.id ?? '',
                    type: data?.relationships?.manufacturer?.data?.type ?? '',
                }
            },
            model: {
                data: {
                    id: data?.relationships?.model?.data?.id ?? '',
                    type: data?.relationships?.model?.data?.type ?? '',
                },
            },
            specification: {
                data: {
                    id: data?.relationships?.specification?.data?.id ?? '',
                    type: data?.relationships?.specification?.data?.type ?? '',
                },
            },
        };
        this.included = data?.included ?? {};
    }

    static hydrate(data: Vehicle): Vehicle {
        return new Vehicle(data);
    }
}
