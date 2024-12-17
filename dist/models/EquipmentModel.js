import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class EquipmentModel extends BaseModel {
    type = 'equipment-models';
    name = '';
    documentation = [];
    manufacturer;
    static relationships = [
        {
            name: 'manufacturer',
            type: 'single',
            modelType: 'equipment-manufacturers'
        }
    ];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.documentation = data?.attributes?.documentation ?? [];
    }
}
