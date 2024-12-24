import { BaseModel } from '@models/BaseModel';
export class VehicleCategory extends BaseModel {
    type = 'vehicle-categories';
    name = '';
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
}
