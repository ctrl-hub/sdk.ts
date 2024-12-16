import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

@RegisterModel
export class VehicleSpecification implements Model {
    public id: string = '';
    public type: string = 'vehicle-specifications';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public emissions: number = 0;
    public engine: string = '';
    public fuel: string = '';
    public transmission: string = '';
    public year: number = 0;
    public documentation: VehicleModelDocumentation[] = [];

    static relationships: RelationshipDefinition[] = [
        {
            name: 'model',
            type: 'single',
            modelType: 'vehicle-models'
        }
    ];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.emissions = data?.attributes?.emissions ?? 0;
        this.engine = data?.attributes?.engine ?? '';
        this.fuel = data?.attributes?.fuel ?? '';
        this.transmission = data?.attributes?.transmission ?? '';
        this.year = data?.attributes?.year ?? 0;
        this.documentation = data?.attributes?.documentation ?? [];

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): VehicleSpecification {
        return new VehicleSpecification(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
