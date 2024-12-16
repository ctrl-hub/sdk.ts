import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class ServiceAccountKey {
    id = '';
    type = 'service-account-keys';
    meta = {};
    links = {};
    _relationships;
    included;
    client_id = '';
    enabled = false;
    static relationships = [];
    constructor(data) {
        this.id = data?.id ?? '';
        this.client_id = data?.attributes?.client_id ?? '';
        this.enabled = data?.attributes?.enabled ?? false;
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new ServiceAccountKey(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
