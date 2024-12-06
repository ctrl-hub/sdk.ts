import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class EquipmentModel {
    id = '';
    type = 'equipment-models';
    attributes;
    meta = {};
    links = {};
    relationships;
    constructor() {
        this.attributes = {
            name: '',
            documentation: [],
        };
    }
    static hydrate(data) {
        let equipmentModel = new EquipmentModel();
        if (data) {
            equipmentModel.id = data.id || '';
            equipmentModel.type = data.type || 'equipment-models';
            equipmentModel.relationships = data.relationships || {};
            equipmentModel.attributes.name = data.attributes.name || '';
            equipmentModel.attributes.documentation = data.attributes.documentation || [];
            equipmentModel.meta = data.meta || {};
            equipmentModel.links = data.links || {};
        }
        return equipmentModel;
    }
}
