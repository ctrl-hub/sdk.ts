import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

@RegisterModel
export class VehicleManufacturer implements Model {
    public id: string = '';
    public type: string = 'vehicle-manufacturers';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public name: string = '';

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): VehicleManufacturer {
        return new VehicleManufacturer(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
