import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';

type EquipmentAttributes = {
    serial: string;
};

@RegisterModel
export class Equipment implements Model {
    public id: string = '';
    public type: string = 'equipment-items';
    public attributes: EquipmentAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;

    constructor() {
        this.attributes = {
            serial: '',
        };
    }

    static hydrate(data: any) {
        let equipment = new Equipment();

        if (data) {
            equipment.id = data.id || '';
            equipment.type = data.type || 'equipment-items';
            equipment.relationships = data.relationships || {};
            equipment.attributes.serial = data.attributes.serial || '';
            equipment.meta = data.meta || {};
            equipment.links = data.links || {};
        }

        return equipment;
    }
}
