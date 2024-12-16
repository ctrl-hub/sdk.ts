import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

@RegisterModel
export class VehicleManufacturer extends BaseModel {
    public type: string = 'vehicle-manufacturers';

    public name: string = '';

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }

    static hydrate(data: any): VehicleManufacturer {
        return new VehicleManufacturer(data);
    }
}
