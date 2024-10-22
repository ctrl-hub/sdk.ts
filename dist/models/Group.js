export class Group {
    id = '';
    type = 'groups';
    attributes;
    meta = {};
    links = {};
    constructor() {
        this.attributes = {
            name: '',
            description: '',
            bindings: []
        };
    }
    static hydrate(data) {
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
