import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class Equipment extends BaseModel {
    type = 'equipment-items';
    serial = '';
    model;
    static relationships = [
        {
            name: 'model',
            type: 'single',
            modelType: 'equipment-models'
        }
    ];
    constructor(data) {
        super(data);
        this.serial = data?.attributes?.serial ?? '';
    }
    static hydrate(data) {
        return new Equipment(data);
    }
}
