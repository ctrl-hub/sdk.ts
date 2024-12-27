import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

type VehicleCategory = {
    id: string;
    name: string;
};

export class VehicleModel extends BaseModel {
    public type: string = 'vehicle-models';

    public name: string = '';
    public categories: VehicleCategory[] = [];

    static relationships: RelationshipDefinition[] = [
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

    constructor(data?: any) {
        super(data);

        this.name = data?.attributes?.name ?? '';

        this.categories = [];

        const categoryData = data?.relationships?.categories?.data ?? [];

        this.categories = categoryData.map((category: any) => ({
            id: category.id,
            name: this.included?.find((inc: any) =>
                inc.type === 'vehicle-categories' && inc.id === category.id
            )?.attributes?.name || ''
        }));
    }

}
