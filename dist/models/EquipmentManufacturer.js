import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class EquipmentManufacturer {
    id = '';
    type = 'equipment-manufacturers';
    attributes;
    meta = {};
    links = {};
    relationships;
    constructor() {
        this.attributes = {
            name: '',
        };
    }
    static hydrate(data) {
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
