import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

type Location = {
    type: "Point";
    coordinates: [number, number]; // Tuple for exactly two numbers
};

type PPE = {
    mask: boolean;
    ear_defenders: boolean;
};

export class EquipmentExposure extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'equipment-exposures';
    public start_time: string; // ISO date string
    public end_time: string; // ISO date string
    public location: Location = {
        type: "Point",
        coordinates: [0,0],
    };
    public ppe: PPE = {
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

    static relationships: RelationshipDefinition[] = [
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

    constructor(data?: any) {
        super(data);
        this.start_time = data?.attributes?.start_time?.id ?? data?.start_time ?? '';
        this.end_time = data?.attributes?.end_time ?? data?.end_time ?? '';

        if (data?.attributes?.location) {
            const locationData = data.attributes.location;

            this.location = {
                type: locationData.type ?? '',
                coordinates: locationData.coordinates ?? []
            }
        }

        if (data?.attributes?.ppe) {
            const ppeData = data.attributes.ppe;

            this.ppe = {
                mask: ppeData.ppe?.mask ?? false,
                ear_defenders: ppeData.ppe?.ear_defenders ?? false
            }
        }
    }
}