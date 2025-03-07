import type { JsonApiMapping } from '../types/JsonApiMapping';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

type Binding = {
    id: string;
    role: string;
    condition: {
        gate: 'AND' | 'OR';
        rules: {
            type: string;
            operator: string;
            key: string;
            value: string;
        }[];
    };
};

export class Group extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'groups';

    public name: string = '';
    public description: string = '';
    public bindings: Binding[] = [];

    static relationships: RelationshipDefinition[] = [
        {
            name: 'users',
            type: 'array',
            modelType: 'users',
        },
    ];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.bindings = data?.attributes?.bindings ?? data?.bindings ?? [];
    }

    jsonApiMapping() {
        return {
            attributes: ['name', 'description', 'bindings'],
            relationships: {},
        };
    }

}
