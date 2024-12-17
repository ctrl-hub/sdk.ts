import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class VehicleModel extends BaseModel {
    type = 'vehicle-models';
    name = '';
    static relationships = [
        {
            name: 'manufacturer',
            type: 'single',
            modelType: 'vehicle-manufacturers'
        }
    ];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
    static hydrate(data) {
        return new VehicleModel(data);
    }
}
