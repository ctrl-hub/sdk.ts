import type { Relationship } from 'types/Relationship';
import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

type EquipmentModelAttributes = {
    name: string;
    documentation: EquipmentModelDocumentation[];
};

type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
};

type EquipmentModelRelationships = {
    manufacturer: Relationship;
};

@RegisterModel
export class EquipmentModel implements Model {
    public id: string = '';
    public type: string = 'equipment-models';
    public attributes: EquipmentModelAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: EquipmentModelRelationships;
    public included?: any;

    constructor(data?: EquipmentModel) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
            documentation: data?.attributes?.documentation ?? [],
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = {
            manufacturer: {
                data: {
                    id: data?.relationships?.manufacturer?.data?.id ?? '',
                    type: data?.relationships?.manufacturer?.data?.type ?? 'equipment-manufacturers',
                },
            },
        };
        this.included = data?.included ?? {};
    }

    static hydrate(data: EquipmentModel): EquipmentModel {
        return new EquipmentModel(data);
    }
}
