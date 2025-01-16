import { BaseModel } from '@models/BaseModel';
export class User extends BaseModel {
    type = 'users';
    firstName = '';
    lastName = '';
    jsonApiMapping() {
        return {
            attributes: ['registration', 'vin', 'description', 'colour'],
            relationships: {
                specification: 'vehicle-specifications',
            },
        };
    }
    static relationships = [];
    constructor(data) {
        super(data);
        this.firstName = data?.attributes?.profile?.personal?.first_name ?? data.firstName ?? '';
        this.lastName = data?.attributes?.profile?.personal?.last_name ?? data.lastName ?? '';
        // this.vin = data?.attributes?.vin ?? data?.vin ?? '';
        // this.description = data?.attributes?.description ?? data?.description ?? '';
        // this.colour = data?.attributes?.colour ?? data?.colour ?? '';
        // this.specification = data?.relationships?.specification?.id ?? data?.specification ?? '';
    }
}
