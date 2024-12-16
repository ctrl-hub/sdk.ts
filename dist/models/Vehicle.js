import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Vehicle {
    id = '';
    type = 'vehicles';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
        this.id = data?.id ?? '';
        this.attributes = {
            registration: data?.attributes?.registration ?? '',
            vin: data?.attributes?.vin ?? '',
            description: data?.attributes?.description ?? '',
            colour: data?.attributes?.colour ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = {
            specification: {
                data: {
                    id: data?.relationships?.specification?.data?.id ?? '',
                    type: data?.relationships?.specification?.data?.type ?? 'vehicle-specifications',
                },
            },
        };
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Vehicle(data);
    }
}
