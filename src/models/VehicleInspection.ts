import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import { JsonApiAttribute, JsonApiRelationship } from '@decorators/JsonApi';
import type { Vehicle } from './Vehicle';
import type { User } from './User';

interface Checks {
  'visible_damage'?: boolean,
  'tyres'?: boolean,
  'washers_and_wipers'?: boolean,
  'windscreen'?: boolean,
  'number_plate'?: boolean,
  'security'?: boolean,
  'accessories'?: boolean,
  'spare_number_plate'?: boolean,
  'safe_access'?: boolean,
  'reversing_alarm'?: boolean,
  'beacons'?: boolean,
  'chemicals_and_fuel'?: boolean,
  'storage'?: boolean,
  'lights_and_indicators'?: boolean,
  'engine_warning_lights'?: boolean,
  'servicing'?: boolean,
  'levels'?: boolean,
  'cleanliness'?: boolean,
  'driver_checks'?: boolean
}

export class VehicleInspection extends BaseModel {
    public type: string = 'vehicle-inspection';
    
    @JsonApiAttribute()
    public inspected_at: string = '';
    
    @JsonApiAttribute()
    public checks?: Checks;
    
    @JsonApiRelationship('users')
    public author?: User | string;
    
    @JsonApiRelationship('vehicles')
    public vehicle?: Vehicle | string;

    static relationships: RelationshipDefinition[] = [
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
