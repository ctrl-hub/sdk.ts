import { BaseModel } from '@models/BaseModel';
export class EquipmentCategory extends BaseModel {
    type = 'equipment-categories';
    name = '';
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
    jsonApiMapping() {
        return {
            attributes: ['name'],
        };
    }
}
