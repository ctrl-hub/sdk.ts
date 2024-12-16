import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class VehicleSpecification {
    id = '';
    type = 'vehicle-specifications';
    meta = {};
    links = {};
    _relationships;
    included;
    emissions = 0;
    engine = '';
    fuel = '';
    transmission = '';
    year = 0;
    documentation = [];
    static relationships = [
        {
            name: 'model',
            type: 'single',
            modelType: 'vehicle-models'
        }
    ];
    constructor(data) {
        this.id = data?.id ?? '';
        this.emissions = data?.attributes?.emissions ?? 0;
        this.engine = data?.attributes?.engine ?? '';
        this.fuel = data?.attributes?.fuel ?? '';
        this.transmission = data?.attributes?.transmission ?? '';
        this.year = data?.attributes?.year ?? 0;
        this.documentation = data?.attributes?.documentation ?? [];
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new VehicleSpecification(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
