import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class VehicleManufacturer {
    id = '';
    type = 'vehicle-manufacturers';
    meta = {};
    links = {};
    _relationships;
    included;
    name = '';
    static relationships = [];
    constructor(data) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new VehicleManufacturer(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
