import { BaseModel } from '@models/BaseModel';
export class VehicleInspection extends BaseModel {
    type = 'vehicle-inspection';
    inspected_at = '';
    checks;
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
            },
        };
    }
    static relationships = [
        {
            name: 'author',
            type: 'single',
            modelType: 'users',
        },
    ];
    constructor(data) {
        super(data);
        this.inspected_at = data?.attributes?.inspected_at ?? data?.inspected_at ?? '';
        this.checks = data?.attributes?.checks ?? [];
    }
}
