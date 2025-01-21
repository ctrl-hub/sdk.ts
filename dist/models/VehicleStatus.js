import { BaseModel } from '@models/BaseModel';
export class VehicleStatus extends BaseModel {
    type = 'vehicle-statuses';
    name = '';
    jsonApiMapping() {
        return {};
    }
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
    }
}
