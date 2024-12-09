import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';

type EquipmentManufacturerAttributes = {
    name: string;
};

@RegisterModel
export class EquipmentManufacturer implements Model {
    public id: string = '';
    public type: string = 'equipment-manufacturers';
    public attributes: EquipmentManufacturerAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;
    public included?: any;

    constructor(data?: EquipmentManufacturer) {
        this.id = data?.id ?? ''
        this.attributes = {
            name: data?.attributes?.name ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: EquipmentManufacturer): EquipmentManufacturer {
        return new EquipmentManufacturer(data);
    }
}
