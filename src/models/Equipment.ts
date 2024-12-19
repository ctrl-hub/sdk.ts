import type { EquipmentModel } from './EquipmentModel';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class Equipment extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'equipment-items';

    public serial: string = '';

    public model?: EquipmentModel | string = '';

    jsonApiMapping() {
        return {
            attributes: ['serial'],
            relationships: {
                model: 'equipment-models',
            },
        };
    }

    static relationships: RelationshipDefinition[] = [
        {
            name: 'model',
            type: 'single',
            modelType: 'equipment-models',
        },
    ];

    constructor(data?: any) {
        super(data);
        this.serial = data?.attributes?.serial ?? data?.serial ?? '';
        this.model = data?.relationships?.model?.id ?? data?.model ?? '';
    }
}
