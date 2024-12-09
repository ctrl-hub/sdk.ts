import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class VehicleManufacturer {
    id = '';
    type = 'vehicle-manufacturers';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new VehicleManufacturer(data);
    }
}
