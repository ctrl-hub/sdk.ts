import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Permission {
    id = '';
    type = 'roles';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
        this.id = data?.id ?? '';
        this.attributes = {
            description: data?.attributes?.description ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Permission(data);
    }
}
