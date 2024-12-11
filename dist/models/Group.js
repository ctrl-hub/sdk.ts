import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Group {
    id = '';
    type = 'groups';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
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
    static hydrate(data) {
        return new Group(data);
    }
}
