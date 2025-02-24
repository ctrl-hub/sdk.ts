import { BaseModel } from '@models/BaseModel';
import { JsonApiAttribute } from '@decorators/JsonApi';

export class VehicleCategory extends BaseModel {
    public type: string = 'vehicle-categories';

    @JsonApiAttribute()
    public name: string = '';

    constructor(data?: any) {
        super(data);
    }
}
