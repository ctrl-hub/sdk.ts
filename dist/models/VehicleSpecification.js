import { BaseModel } from '@models/BaseModel';
export class VehicleSpecification extends BaseModel {
    type = 'vehicle-specifications';
    emissions = 0;
    engine_capacity = '';
    fuel_type = '';
    year = 0;
    wheelplan = '';
    documentation = [];
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
        this.engine_capacity = data?.attributes?.engine_capacity ?? '';
        this.fuel_type = data?.attributes?.fuel_type ?? '';
        this.year = data?.attributes?.year ?? 0;
        this.wheelplan = data?.attributes?.wheelplan ?? '';
        this.documentation = data?.attributes?.documentation ?? [];
    }
}
