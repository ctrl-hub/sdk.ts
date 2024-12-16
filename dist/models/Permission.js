import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Permission {
    id = '';
    type = 'permissions';
    meta = {};
    links = {};
    _relationships;
    included;
    description = '';
    static relationships = [];
    constructor(data) {
        this.id = data?.id ?? '';
        this.description = data?.attributes?.description ?? '';
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Permission(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
