import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

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

type GroupAttributes = {
    name: string;
    description: string;
    bindings: Binding[];
};

@RegisterModel
export class Group implements Model {
    public id: string = '';
    public type: string = 'groups';
    public attributes: GroupAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;
    public included?: any;

    constructor(data?: Group) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
            description: data?.attributes?.description ?? '',
            bindings: data?.attributes?.bindings ?? [],
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Group {
        return new Group(data);
    }
}
