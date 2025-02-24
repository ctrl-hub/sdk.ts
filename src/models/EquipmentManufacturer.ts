import { BaseModel } from '@models/BaseModel';
import { JsonApiAttribute } from '@decorators/JsonApi';

export class EquipmentManufacturer extends BaseModel {
    public type: string = 'equipment-manufacturers';

    @JsonApiAttribute()
    public name: string = '';
}
