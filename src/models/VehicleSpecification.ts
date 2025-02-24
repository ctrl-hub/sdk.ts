import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import { JsonApiAttribute, JsonApiRelationship } from '@decorators/JsonApi';
import type { VehicleModel } from './VehicleModel';

type VehicleModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

export class VehicleSpecification extends BaseModel {
    public type: string = 'vehicle-specifications';

    @JsonApiAttribute()
    public emissions: number = 0;
    
    @JsonApiAttribute()
    public engine_capacity: string = '';
    
    @JsonApiAttribute()
    public fuel_type: string = '';
    
    @JsonApiAttribute()
    public year: number = 0;
    
    @JsonApiAttribute()
    public wheelplan: string = '';
    
    @JsonApiAttribute()
    public documentation: VehicleModelDocumentation[] = [];

    @JsonApiRelationship('vehicle-models')
    public model?: VehicleModel | string;

    static relationships: RelationshipDefinition[] = [
        {
            name: 'model',
            type: 'single',
            modelType: 'vehicle-models'
        }
    ];

    constructor(data?: any) {
        super(data);
    }
}
