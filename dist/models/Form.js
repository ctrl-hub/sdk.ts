import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Form {
    id = '';
    type = 'forms';
    meta = {};
    links = {};
    _relationships;
    included;
    name = '';
    description = '';
    field_mappings = [];
    status = '';
    formType = '';
    static relationships = [];
    constructor(data) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.field_mappings = data?.attributes?.field_mappings ?? [];
        this.status = data?.attributes?.status ?? '';
        this.formType = data?.attributes?.type ?? '';
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Form(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
