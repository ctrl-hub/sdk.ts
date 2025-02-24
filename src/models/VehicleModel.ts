import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import { JsonApiAttribute, JsonApiRelationship } from '@decorators/JsonApi';
import type { VehicleManufacturer } from './VehicleManufacturer';

type VehicleCategory = {
    id: string;
    name: string;
};

export class VehicleModel extends BaseModel {
    public type: string = 'vehicle-models';

    @JsonApiAttribute()
    public name: string = '';
    
    public categories: VehicleCategory[] = [];
    
    @JsonApiRelationship('vehicle-manufacturers')
    public manufacturer?: VehicleManufacturer | string;

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
