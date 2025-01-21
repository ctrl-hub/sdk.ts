import type { JsonApiMapping } from 'types/JsonApiMapping';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

export class VehicleSpecification extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'vehicle-specifications';

    public emissions: number = 0;
    public engine_capacity: string = '';
    public fuel_type: string = '';
    public year: number = 0;
    public wheelplan: string = '';
    public documentation: VehicleModelDocumentation[] = [];

    jsonApiMapping() {
        return {
            attributes: ['emissions', 'engine_capacity', 'fuel_type', 'year', 'wheelplan', 'documentation'],
        };
    }

    static relationships: RelationshipDefinition[] = [
        {
            name: 'model',
            type: 'single',
            modelType: 'vehicle-models'
        }
    ];

    constructor(data?: any) {
        super(data);
        this.emissions = data?.attributes?.emissions ?? data?.emissions ?? 0;
        this.engine_capacity = data?.attributes?.engine_capacity ?? data?.engine_capacity ?? '';
        this.fuel_type = data?.attributes?.fuel_type ?? data?.fuel_type ?? '';
        this.year = data?.attributes?.year ?? data?.year ?? 0;
        this.wheelplan = data?.attributes?.wheelplan ?? data?.wheelplan ?? '';
        this.documentation = data?.attributes?.documentation ?? [];
    }

}
