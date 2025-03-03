import { BaseModel } from './BaseModel';
export class EquipmentCategory extends BaseModel {
    type = 'equipment-categories';
    name = '';
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
