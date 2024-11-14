import type { Model } from "../types/Model";

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

export class Group implements Model {
    public id: string = '';
    public type: string = 'groups';
    public attributes: GroupAttributes;
    public meta: any = {};
    public links: any = {};

    constructor() {
        this.attributes = {
            name: '',
            description: '',
            bindings: []
        };
    }

    static hydrate(data: any) {
        let group = new Group();

        if (data) {
            group.id = data.id || '';
            group.type = data.type || 'groups';
            group.attributes.name = data.attributes?.name || '';
            group.attributes.description = data.attributes?.description || '';
            group.attributes.bindings = data.attributes?.bindings || [];

            // Map relationships
            // group.relationships.service_accounts.data = data.relationships?.service_accounts?.data || [];
            // group.relationships.users.data = data.relationships?.users?.data || [];

            // Meta and links
            group.meta = data.meta || {};
            group.links = data.links || {};
        }

        return group;
    }
}
