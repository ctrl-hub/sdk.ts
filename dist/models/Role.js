import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Role {
    id = '';
    type = 'roles';
    meta = {};
    links = {};
    _relationships;
    included;
    custom = false;
    name = '';
    description = '';
    launch_stage = '';
    permissions = [];
    static relationships = [];
    constructor(data) {
        this.id = data?.id ?? '';
        this.custom = data?.attributes?.custom ?? false;
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.launch_stage = data?.attributes?.launch_stage ?? '';
        this.permissions = data?.attributes?.permissions ?? [];
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Role(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
