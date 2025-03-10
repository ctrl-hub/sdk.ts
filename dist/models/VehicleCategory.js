import { BaseModel } from './BaseModel';
export class VehicleCategory extends BaseModel {
    type = 'vehicle-categories';
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
