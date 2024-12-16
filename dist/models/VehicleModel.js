import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class VehicleModel {
    id = '';
    type = 'vehicle-models';
    meta = {};
    links = {};
    _relationships;
    included;
    name = '';
    static relationships = [
        {
            name: 'manufacturer',
            type: 'single',
            modelType: 'vehicle-manufacturers'
        }
    ];
    constructor(data) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new VehicleModel(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
