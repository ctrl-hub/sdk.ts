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
    public included?: any;

    constructor(data?: EquipmentModel) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
            documentation: data?.attributes?.documentation ?? [],
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: EquipmentModel): EquipmentModel {
        return new EquipmentModel(data);
    }
}
