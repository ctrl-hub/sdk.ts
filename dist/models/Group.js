import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Group {
    id = '';
    type = 'groups';
    meta = {};
    links = {};
    _relationships;
    included;
    name = '';
    description = '';
    bindings = [];
    static relationships = [];
    constructor(data) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.bindings = data?.attributes?.bindings ?? [];
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Group(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
