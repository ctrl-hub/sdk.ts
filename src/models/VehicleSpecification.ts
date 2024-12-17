import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

@RegisterModel
export class VehicleSpecification extends BaseModel {
    public type: string = 'vehicle-specifications';

    public emissions: number = 0;
    public engine: string = '';
    public fuel: string = '';
    public transmission: string = '';
    public year: number = 0;
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
        this.engine = data?.attributes?.engine ?? '';
        this.fuel = data?.attributes?.fuel ?? '';
        this.transmission = data?.attributes?.transmission ?? '';
        this.year = data?.attributes?.year ?? 0;
        this.documentation = data?.attributes?.documentation ?? [];
    }

    static hydrate(data: any): VehicleSpecification {
        return new VehicleSpecification(data);
    }
}
