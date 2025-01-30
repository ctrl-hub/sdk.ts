import { VehicleSpecification } from '@models/VehicleSpecification';
import { BaseModel } from '@models/BaseModel';
export class Vehicle extends BaseModel {
    type = 'vehicles';
    registration = '';
    vin = '';
    description = '';
    colour = '';
    specification = '';
    status = '';
    jsonApiMapping() {
        return {
            attributes: ['registration', 'vin', 'description', 'colour', 'status'],
            relationships: {
                specification: 'vehicle-specifications',
            },
        };
    }
    static relationships = [
        {
            name: 'specification',
            type: 'single',
            modelType: 'vehicle-specifications',
        },
        {
            name: 'assignee',
            type: 'single',
            modelType: 'users',
        }
    ];
    constructor(data) {
        super(data);
        this.registration = data?.attributes?.registration ?? data?.registration ?? '';
        this.vin = data?.attributes?.vin ?? data?.vin ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.colour = data?.attributes?.colour ?? data?.colour ?? '';
        this.specification = data?.relationships?.specification?.id ?? data?.specification ?? '';
        this.status = data?.attributes?.status ?? data?.status ?? '';
    }
}
