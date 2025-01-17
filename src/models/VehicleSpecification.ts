import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

export class VehicleSpecification extends BaseModel {
    public type: string = 'vehicle-specifications';

    public emissions: number = 0;
    public engine_capacity: string = '';
    public fuel_type: string = '';
    public year: number = 0;
    public wheelplan: string = '';
    public documentation: VehicleModelDocumentation[] = [];

    static relationships: RelationshipDefinition[] = [
        {
            name: 'model',
            type: 'single',
            modelType: 'vehicle-models'
        }
    ];

    constructor(data?: any) {
        super(data);
        this.emissions = data?.attributes?.emissions ?? 0;
        this.engine_capacity = data?.attributes?.engine_capacity ?? '';
        this.fuel_type = data?.attributes?.fuel_type ?? '';
        this.year = data?.attributes?.year ?? 0;
        this.wheelplan = data?.attributes?.wheelplan ?? '';
        this.documentation = data?.attributes?.documentation ?? [];
    }

}
