import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class EquipmentModel {
    id = '';
    type = 'equipment-models';
    meta = {};
    links = {};
    _relationships;
    included;
    name = '';
    documentation = [];
    manufacturer;
    static relationships = [
        {
            name: 'manufacturer',
            type: 'single',
            modelType: 'equipment-manufacturers'
        }
    ];
    constructor(data) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';
        this.documentation = data?.attributes?.documentation ?? [];
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new EquipmentModel(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
