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
            manufacturer: {
                data: {
                    id: data?.relationships?.manufacturer?.data?.id ?? '',
                    type: data?.relationships?.manufacturer?.data?.type ?? '',
                }
            },
            model: {
                data: {
                    id: data?.relationships?.model?.data?.id ?? '',
                    type: data?.relationships?.model?.data?.type ?? '',
                },
            },
            specification: {
                data: {
                    id: data?.relationships?.specification?.data?.id ?? '',
                    type: data?.relationships?.specification?.data?.type ?? '',
                },
            },
        };
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Vehicle(data);
    }
}
