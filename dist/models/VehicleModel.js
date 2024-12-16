import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class VehicleModel {
    id = '';
    type = 'vehicle-models';
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
        this.relationships = {
            manufacturer: {
                data: {
                    id: data?.relationships?.manufacturer?.data?.id ?? '',
                    type: data?.relationships?.manufacturer?.data?.type ?? 'vehicle-manufacurers',
                },
            },
        };
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new VehicleModel(data);
    }
}
