import { BaseModel } from '@models/BaseModel';
export class VehicleSpecification extends BaseModel {
    type = 'vehicle-specifications';
    emissions = 0;
    engine_capacity = '';
    fuel_type = '';
    year = 0;
    wheelplan = '';
    documentation = [];
    jsonApiMapping() {
        return {
            attributes: ['emissions', 'engine_capacity', 'fuel_type', 'year', 'wheelplan', 'documentation'],
        };
    }
    static relationships = [
        {
            name: 'model',
            type: 'single',
            modelType: 'vehicle-models'
        }
    ];
    constructor(data) {
        super(data);
        this.emissions = data?.attributes?.emissions ?? data?.emissions ?? 0;
        this.engine_capacity = data?.attributes?.engine_capacity ?? data?.engine_capacity ?? '';
        this.fuel_type = data?.attributes?.fuel_type ?? data?.fuel_type ?? '';
        this.year = data?.attributes?.year ?? data?.year ?? 0;
        this.wheelplan = data?.attributes?.wheelplan ?? data?.wheelplan ?? '';
        this.documentation = data?.attributes?.documentation ?? [];
    }
}
