import type { Relationship } from 'types/Relationship';
import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

type EquipmentAttributes = {
    serial: string;
};

type EquipmentRelationships = {
    manufacturer: Relationship;
    model: Relationship;
};

@RegisterModel
export class Equipment implements Model {
    public id: string = '';
    public type: string = 'equipment-items';
    public attributes: EquipmentAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: EquipmentRelationships;
    public included?: any;

    constructor(data?: Equipment) {
        this.id = data?.id ?? '';
        this.attributes = {
            serial: data?.attributes?.serial ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = {
            manufacturer: {
                data: {
                    id: data?.relationships?.manufacturer?.data?.id ?? '',
                    type: data?.relationships?.manufacturer?.data?.type ?? '',
                },
            },
            model: {
                data: {
                    id: data?.relationships?.model?.data?.id ?? '',
                    type: data?.relationships?.model?.data?.type ?? '',
                },
            },
        };
        this.included = data?.included ?? {};
    }

    static hydrate(data: Equipment): Equipment {
        return new Equipment(data);
    }
}
