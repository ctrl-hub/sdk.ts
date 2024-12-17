import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
import { VehicleModel } from '@models/VehicleModel';
@RegisterModel
export class VehicleSpecification extends BaseModel {
    type = 'vehicle-specifications';
    emissions = 0;
    engine = '';
    fuel = '';
    transmission = '';
    year = 0;
    documentation = [];
    model;
    static relationships = [
        {
            name: 'model',
            type: 'single',
            modelType: 'vehicle-models'
        }
    ];
    constructor(data) {
        super(data);
        this.emissions = data?.attributes?.emissions ?? 0;
        this.engine = data?.attributes?.engine ?? '';
        this.fuel = data?.attributes?.fuel ?? '';
        this.transmission = data?.attributes?.transmission ?? '';
        this.year = data?.attributes?.year ?? 0;
        this.documentation = data?.attributes?.documentation ?? [];
        this.model = new VehicleModel();
    }
    static hydrate(data) {
        return new VehicleSpecification(data);
    }
}
