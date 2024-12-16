import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Equipment {
    id = '';
    type = 'equipment-items';
    meta = {};
    links = {};
    included;
    _relationships;
    serial = '';
    model;
    static relationships = [
        {
            name: 'model',
            type: 'single',
            modelType: 'equipment-models'
        }
    ];
    constructor(data) {
        this.id = data?.id ?? '';
        this.serial = data?.attributes?.serial ?? '';
        this._relationships = data?.relationships ?? {};
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Equipment(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
