import { BaseModel } from './BaseModel';
export class VehicleManufacturer extends BaseModel {
    type = 'vehicle-manufacturers';
    name = '';
    static relationships = [];
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
