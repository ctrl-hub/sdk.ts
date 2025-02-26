import { BaseModel } from '@models/BaseModel';
export class EquipmentExposure extends BaseModel {
    type = 'equipment-exposures';
    start_time; // ISO date string
    end_time; // ISO date string
    location = {
        type: "Point",
        coordinates: [0, 0],
    };
    ppe = {
        mask: false,
        ear_defenders: false,
    };
    jsonApiMapping() {
        return {
            attributes: ['end_time', 'location', 'ppe', 'start_time'],
            relationships: {
                author: 'author',
                equipment: 'equipment',
            },
        };
    }
    static relationships = [
        {
            name: 'author',
            type: 'single',
            modelType: 'users',
        },
        {
            name: 'equipment',
            type: 'single',
            modelType: 'equipment',
        },
    ];
    constructor(data) {
        super(data);
        this.start_time = data?.attributes?.start_time?.id ?? data?.start_time ?? '';
        this.end_time = data?.attributes?.end_time ?? data?.end_time ?? '';
        if (data?.attributes?.location) {
            const locationData = data.attributes.location;
            this.location = {
                type: locationData.type ?? '',
                coordinates: locationData.coordinates ?? []
            };
        }
        if (data?.location) {
            const locationData = data.location;
            this.location = {
                type: locationData.type ?? '',
                coordinates: locationData.coordinates ?? []
            };
        }
        if (data?.attributes?.ppe) {
            const ppeData = data.attributes?.ppe;
            this.ppe = {
                mask: ppeData.ppe?.mask ?? false,
                ear_defenders: ppeData.ppe?.ear_defenders ?? false
            };
        }
        if (data?.ppe) {
            const ppeData = data.ppe;
            this.ppe = {
                mask: ppeData.mask ?? false,
                ear_defenders: ppeData.ear_defenders ?? false
            };
        }
    }
}
