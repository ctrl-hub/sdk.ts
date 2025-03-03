import { BaseModel } from './BaseModel';
export class EquipmentManufacturer extends BaseModel {
    type = 'equipment-manufacturers';
    name = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
    }
    jsonApiMapping() {
        return {
            attributes: ['name'],
        };
    }
}
