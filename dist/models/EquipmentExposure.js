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
                type: locationData.location?.type ?? '',
                coordinates: locationData.location?.coordinates ?? []
            };
        }
        if (data?.attributes?.ppe) {
            const ppeData = data.attributes.ppe;
            this.ppe = {
                mask: ppeData.ppe?.mask ?? false,
                ear_defenders: ppeData.ppe?.ear_defenders ?? false
            };
        }
    }
}
/*
      "attributes": {
        "end_time": "2024-12-17T19:26:00Z",
        "location": {
          "type": "Point",
          "coordinates": [
            0.5484145,
            0.156465
          ]
        },
        "ppe": {
          "mask": true,
          "ear_defenders": true
        },
        "start_time": "2024-12-17T16:42:00Z"
      },
  */ 
