import { BaseModel } from '@models/BaseModel';
export class EquipmentModel extends BaseModel {
    type = 'equipment-models';
    name = '';
    description = '';
    specification;
    categories = [];
    documentation = [];
    manufacturer;
    static relationships = [
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
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.documentation = data?.attributes?.documentation ?? [];
        this.categories = [];
        this.specification = data?.attributes?.specification ?? {};
        const categoryData = data?.relationships?.categories?.data ?? [];
        this.categories = categoryData.map((category) => ({
            id: category.id,
            name: this.included?.find((inc) => inc.type === 'equipment-categories' && inc.id === category.id)?.attributes?.name || ''
        }));
    }
}
