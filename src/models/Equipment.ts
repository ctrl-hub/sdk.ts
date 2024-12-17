import { RegisterModel } from '../utils/ModelRegistry';
import type { EquipmentModel } from './EquipmentModel';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

@RegisterModel
export class Equipment extends BaseModel {
    public type: string = 'equipment-items';

    public serial: string = '';

    public model?: EquipmentModel;

    static relationships: RelationshipDefinition[] = [
        {
            name: 'model',
            type: 'single',
            modelType: 'equipment-models'
        }
    ];

    constructor(data?: any) {
        super(data);
        this.serial = data?.attributes?.serial ?? '';
    }

    static hydrate(data: any): Equipment {
        return new Equipment(data);
    }
}