import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import { JsonApiAttribute, JsonApiRelationship } from '@decorators/JsonApi';
import type { Vehicle } from './Vehicle';
import type { User } from './User';
import type { Equipment } from './Equipment';

interface Item {
    'equipment_id': string,
    'present'?: boolean,
    'working'?: boolean,
    'cerified'?: boolean
}

export class VehicleInventoryCheck extends BaseModel {
    public type: string = 'vehicle-inventory-checks';

    @JsonApiAttribute()
    public inspected_at: string = '';

    @JsonApiAttribute()
    public items?: Item[] = [];
    
    @JsonApiRelationship('equipment-items')
    public equipment?: Equipment[] | string[];
    
    @JsonApiRelationship('users')
    public author?: User | string;
    
    @JsonApiRelationship('vehicles')
    public vehicle?: Vehicle | string;

    static relationships: RelationshipDefinition[] = [
        {
            name: 'equipment',
            type: 'array',
            modelType: 'equipment-items',
        },
        {
            name: 'author',
            type: 'single',
            modelType: 'users',
        },
        {
            name: 'vehicle',
            type: 'single',
            modelType: 'vehicles',
        },
    ];

    constructor(data?: any) {
        super(data);
    }
}
