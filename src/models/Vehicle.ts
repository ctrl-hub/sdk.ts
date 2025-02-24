import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { VehicleSpecification } from '@models/VehicleSpecification';
import { BaseModel } from '@models/BaseModel';
import { JsonApiAttribute, JsonApiRelationship } from '@decorators/JsonApi';
import type { User } from '@models/User';

export class Vehicle extends BaseModel {
    public type: string = 'vehicles';

    @JsonApiAttribute()
    public registration: string = '';
    
    @JsonApiAttribute()
    public vin: string = '';
    
    @JsonApiAttribute()
    public description: string = '';
    
    @JsonApiAttribute()
    public colour: string = '';
    
    @JsonApiRelationship('vehicle-specifications')
    public specification?: VehicleSpecification | string = '';

    @JsonApiRelationship('users')
    public assignee?: User | string = '';

    @JsonApiAttribute()
    public status?: string = '';

    static relationships: RelationshipDefinition[] = [
        {
            name: 'specification',
            type: 'single',
            modelType: 'vehicle-specifications',
        },
        {
            name: 'equipment',
            type: 'array',
            modelType: 'equipment',
        }
    ];

}
