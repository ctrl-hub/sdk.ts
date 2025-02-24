import type { EquipmentModel } from './EquipmentModel';
import { BaseModel } from '@models/BaseModel';
import { JsonApiAttribute, JsonApiRelationship } from '@decorators/JsonApi';

export class Equipment extends BaseModel {
    public type: string = 'equipment-items';

    @JsonApiAttribute()
    public serial: string = '';

    @JsonApiRelationship('equipment-models')
    public model?: EquipmentModel | string = '';
}
