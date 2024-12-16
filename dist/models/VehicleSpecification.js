import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class VehicleSpecification {
    id = '';
    type = 'vehicle-specifications';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
        this.id = data?.id ?? '';
        this.attributes = {
            emissions: data?.attributes?.emissions ?? 0,
            engine: data?.attributes?.engine ?? '',
            fuel: data?.attributes?.fuel ?? '',
            transmission: data?.attributes?.transmission ?? '',
            year: data?.attributes?.year ?? 0,
            documentation: data?.attributes?.documentation ?? [],
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = {
            model: {
                data: {
                    id: data?.relationships?.model?.data?.id ?? '',
                    type: data?.relationships?.model?.data?.type ?? 'vehicle-models',
                },
            },
        };
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new VehicleSpecification(data);
    }
}
