import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';
import type { EquipmentManufacturer } from './EquipmentManufacturer';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

@RegisterModel
export class EquipmentModel implements Model {
    public id: string = '';
    public type: string = 'equipment-models';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public name: string = '';
    public documentation: EquipmentModelDocumentation[] = [];

    public manufacturer?: EquipmentManufacturer;

    static relationships: RelationshipDefinition[] = [
        {
            name: 'manufacturer',
            type: 'single',
            modelType: 'equipment-manufacturers'
        }
    ];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';
        this.documentation = data?.attributes?.documentation ?? [];

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): EquipmentModel {
        return new EquipmentModel(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
