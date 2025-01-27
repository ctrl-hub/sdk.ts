import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class Team extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'teams';

    public name: string = '';

    jsonApiMapping() {
        return {
            attributes: ['name'],
            relationships: {
                members: 'users',
            },
        };
    }

    static relationships: RelationshipDefinition[] = [
        {
            name: 'members',
            type: 'array',
            modelType: 'users',
        },
    ];

    constructor(data?: any) {
        super(data);

        this.name = data?.attributes?.name ?? data?.name ?? '';
    }
}
