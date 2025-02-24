import type { EquipmentManufacturer } from './EquipmentManufacturer';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { EquipmentCategory } from '@models/EquipmentCategory';
import { JsonApiAttribute, JsonApiRelationship } from '@decorators/JsonApi';

type EquipmentModelDocumentation = {
    name: string;
    description: string;
    link: string;
}

type EquipmentModelSpecification = {
    vibration?: {
        magnitude: number;
    };
}

export class EquipmentModel extends BaseModel {
    public type: string = 'equipment-models';

    @JsonApiAttribute()
    public name: string = '';
    
    @JsonApiAttribute()
    public description: string = '';
    
    @JsonApiAttribute()
    public specification: EquipmentModelSpecification = {};
    
    public categories: EquipmentCategory[] = [];
    
    @JsonApiAttribute()
    public documentation: EquipmentModelDocumentation[] = [];

    @JsonApiRelationship('equipment-manufacturers')
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
        
        const categoryData = data?.relationships?.categories?.data ?? [];

        this.categories = categoryData.map((category: any) => ({
            id: category.id,
            name: this.included?.find((inc: any) =>
                inc.type === 'equipment-categories' && inc.id === category.id
            )?.attributes?.name || ''
        }));
    }

}
