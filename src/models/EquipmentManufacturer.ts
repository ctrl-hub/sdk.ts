import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

@RegisterModel
export class EquipmentManufacturer extends BaseModel {
    public type: string = 'equipment-manufacturers';

    public name: string = '';

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }

    static hydrate(data: any): EquipmentManufacturer {
        return new EquipmentManufacturer(data);
    }
}
