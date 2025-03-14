import type { EquipmentManufacturer } from './EquipmentManufacturer';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { EquipmentCategory } from '@models/EquipmentCategory';

type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

type EquipmentModelSpecification = {
    vibration: {
        magnitude: number;
    };
}

export class EquipmentModel extends BaseModel {
    public type: string = 'equipment-models';

    public name: string = '';
    public description: string = '';
    public specification: EquipmentModelSpecification;
    public categories: EquipmentCategory[] = [];
    public documentation: EquipmentModelDocumentation[] = [];

    public manufacturer?: EquipmentManufacturer;

    static relationships: RelationshipDefinition[] = [
        {
            name: 'manufacturer',
            type: 'single',
            modelType: 'equipment-manufacturers'
        },
        {
            name: 'categories',
            type: 'array',
            modelType: 'equipment-categories'
        }
    ];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.documentation = data?.attributes?.documentation ?? [];
        this.categories = [];

        this.specification = data?.attributes?.specification ?? {};

        const categoryData = data?.relationships?.categories?.data ?? [];

        this.categories = categoryData.map((category: any) => ({
            id: category.id,
            name: this.included?.find((inc: any) =>
                inc.type === 'equipment-categories' && inc.id === category.id
            )?.attributes?.name || ''
        }));
    }

}
