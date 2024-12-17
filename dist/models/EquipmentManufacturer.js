import { BaseModel } from '@models/BaseModel';
export class EquipmentManufacturer extends BaseModel {
    type = 'equipment-manufacturers';
    name = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
}
