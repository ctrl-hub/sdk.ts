import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import { JsonApiAttribute } from '@decorators/JsonApi';

export class VehicleManufacturer extends BaseModel {
    public type: string = 'vehicle-manufacturers';

    @JsonApiAttribute()
    public name: string = '';

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
    }
}
