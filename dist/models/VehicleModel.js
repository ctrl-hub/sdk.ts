import { BaseModel } from './BaseModel';
export class VehicleModel extends BaseModel {
    type = 'vehicle-models';
    name = '';
    categories = [];
    static relationships = [
        {
            name: 'manufacturer',
            type: 'single',
            modelType: 'vehicle-manufacturers'
        },
        {
            name: 'categories',
            type: 'array',
            modelType: 'vehicle-categories'
        }
    ];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.categories = [];
        const categoryData = data?.relationships?.categories?.data ?? [];
        this.categories = categoryData.map((category) => ({
            id: category.id,
            name: this.included?.find((inc) => inc.type === 'vehicle-categories' && inc.id === category.id)?.attributes?.name || ''
        }));
    }
}
