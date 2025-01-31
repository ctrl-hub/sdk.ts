import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';
interface Checks {
    'visible_damage'?: boolean;
    'tyres'?: boolean;
    'washers_and_wipers'?: boolean;
    'windscreen'?: boolean;
    'number_plate'?: boolean;
    'security'?: boolean;
    'accessories'?: boolean;
    'spare_number_plate'?: boolean;
    'safe_access'?: boolean;
    'reversing_alarm'?: boolean;
    'beacons'?: boolean;
    'chemicals_and_fuel'?: boolean;
    'storage'?: boolean;
    'lights_and_indicators'?: boolean;
    'engine_warning_lights'?: boolean;
    'servicing'?: boolean;
    'levels'?: boolean;
    'cleanliness'?: boolean;
    'driver_checks'?: boolean;
}
export declare class VehicleInspection extends BaseModel implements Partial<JsonApiMapping> {
    type: string;
    inspected_at: string;
    checks?: Checks;
    jsonApiMapping(): {
        attributes: string[];
        relationships: {
            author: string;
            vehicle: string;
        };
    };
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
}
export {};
