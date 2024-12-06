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

    constructor() {
        this.attributes = {
            name: '',
        };
    }

    static hydrate(data: any) {
        let equipmentManufacturer = new EquipmentManufacturer();

        if (data) {
            equipmentManufacturer.id = data.id || '';
            equipmentManufacturer.type = data.type || 'equipment-manufacturers';
            equipmentManufacturer.relationships = data.relationships || {};
            equipmentManufacturer.attributes.name = data.attributes.name || '';
            equipmentManufacturer.meta = data.meta || {};
            equipmentManufacturer.links = data.links || {};
        }

        return equipmentManufacturer;
    }
}
