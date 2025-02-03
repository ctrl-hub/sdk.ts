import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

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

export class VehicleInspection extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'vehicle-inspection';
    public inspected_at: string = '';
    public checks?: Checks;

    jsonApiMapping() {
        return {
            attributes: [
              'visible_damage',
              'tyres',
              'washers_and_wipers',
              'windscreen',
              'number_plate',
              'security',
              'accessories',
              'spare_number_plate',
              'safe_access',
              'reversing_alarm',
              'beacons',
              'chemicals_and_fuel',
              'storage',
              'lights_and_indicators',
              'engine_warning_lights',
              'servicing',
              'levels',
              'cleanliness',
              'driver_checks'
            ],
            relationships: {
                author: 'author',
                vehicle: 'vehicle',
            },
        };
    }

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
        this.inspected_at = data?.attributes?.inspected_at ?? data?.inspected_at ?? '';
        this.checks = data?.attributes?.checks ?? [];
    }
}
