import { BaseModel } from '@models/BaseModel';
export class Equipment extends BaseModel {
    type = 'equipment-items';
    serial = '';
    model = '';
    jsonApiMapping() {
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
