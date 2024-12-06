import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';

type EquipmentModelAttributes = {
    name: string;
    documentation: EquipmentModelDocumentation[];
};

type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

@RegisterModel
export class EquipmentModel implements Model {
    public id: string = ''; 
    public type: string = 'equipment-models';
    public attributes: EquipmentModelAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;

    constructor() {
        this.attributes = {
            name: '',
            documentation: [],
        };
    }

    static hydrate(data: any) {
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
