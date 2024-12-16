import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class EquipmentManufacturer extends BaseModel {
    type = 'equipment-manufacturers';
    name = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
    static hydrate(data) {
        return new EquipmentManufacturer(data);
    }
}
