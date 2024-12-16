import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { VehicleSpecification } from '@models/VehicleSpecification';

@RegisterModel
export class Vehicle implements Model {
    public id: string = '';
    public type: string = 'vehicles';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public registration: string = '';
    public vin: string = '';
    public description: string = '';
    public colour: string = '';

    public specification?: VehicleSpecification;

    static relationships: RelationshipDefinition[] = [
        {
            name: 'model',
            type: 'single',
            modelType: 'vehicle-models'
        },
        {
            name: 'specification',
            type: 'single',
            modelType: 'vehicle-specifications'
        }
    ];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.registration = data?.attributes?.registration ?? '';
        this.vin = data?.attributes?.vin ?? '';
        this.description = data?.attributes?.description ?? '';
        this.colour = data?.attributes?.colour ?? '';

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Vehicle {
        return new Vehicle(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
