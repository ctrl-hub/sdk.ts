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
    public included?: any;

    constructor(data?: VehicleManufacturer) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: VehicleManufacturer): VehicleManufacturer {
        return new VehicleManufacturer(data);
    }
}
