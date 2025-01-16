import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class User extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'users';

    public firstName: string = '';
    public lastName: string = '';

    jsonApiMapping() {
        return {
            attributes: ['registration', 'vin', 'description', 'colour'],
            relationships: {
                specification: 'vehicle-specifications',
            },
        };
    }

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.firstName = data?.attributes?.profile?.personal?.first_name ?? data.firstName ?? '';
        this.lastName = data?.attributes?.profile?.personal?.last_name ?? data.lastName ?? '';
        // this.vin = data?.attributes?.vin ?? data?.vin ?? '';
        // this.description = data?.attributes?.description ?? data?.description ?? '';
        // this.colour = data?.attributes?.colour ?? data?.colour ?? '';
        // this.specification = data?.relationships?.specification?.id ?? data?.specification ?? '';
    }
}
