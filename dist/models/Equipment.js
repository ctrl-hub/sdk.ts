import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class Equipment extends BaseModel {
    type = 'equipment-items';
    serial = '';
    model = '';
    getApiMapping() {
        return {
            attributes: ['serial'],
            relationships: {
                model: 'equipment-models'
            }
        };
    }
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
        this.model = '';
    }
}
