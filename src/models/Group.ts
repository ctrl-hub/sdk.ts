import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

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
export class Group implements Model {
    public id: string = '';
    public type: string = 'groups';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public name: string = '';
    public description: string = '';
    public bindings: Binding[] = [];

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.bindings = data?.attributes?.bindings ?? [];
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Group {
        return new Group(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
