import type { EquipmentManufacturer } from './EquipmentManufacturer';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

export class EquipmentModel extends BaseModel {
    public type: string = 'equipment-models';

    public name: string = '';
    public documentation: EquipmentModelDocumentation[] = [];

    public manufacturer?: EquipmentManufacturer;

    static relationships: RelationshipDefinition[] = [
        {
            name: 'manufacturer',
            type: 'single',
            modelType: 'equipment-manufacturers'
        }
    ];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.documentation = data?.attributes?.documentation ?? [];
    }

}
