import { BaseModel } from '@models/BaseModel';

export class EquipmentCategory extends BaseModel {
    public type: string = 'equipment-categories';

    public name: string = '';

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
}
