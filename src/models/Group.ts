import { RegisterModel } from '../utils/ModelRegistry';
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
            value: string;
        }[];
    };
};

@RegisterModel
export class Group extends BaseModel {
    public type: string = 'groups';

    public name: string = '';
    public description: string = '';
    public bindings: Binding[] = [];

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.bindings = data?.attributes?.bindings ?? [];
    }

    static hydrate(data: any): Group {
        return new Group(data);
    }
}
