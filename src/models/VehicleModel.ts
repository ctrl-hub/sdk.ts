import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class VehicleModel extends BaseModel {
    public type: string = 'vehicle-models';

    public name: string = '';

    static relationships: RelationshipDefinition[] = [
        {
            name: 'manufacturer',
            type: 'single',
            modelType: 'vehicle-manufacturers'
        }
    ];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }

}
