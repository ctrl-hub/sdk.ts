import { BaseModel } from '@models/BaseModel';

export class VehicleCategory extends BaseModel {
    public type: string = 'vehicle-categories';

    public name: string = '';

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
}
