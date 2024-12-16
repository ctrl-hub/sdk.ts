import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class ServiceAccount {
    id = '';
    type = 'service-accounts';
    meta = {};
    links = {};
    _relationships;
    included;
    name = '';
    description = '';
    email = '';
    enabled = false;
    static relationships = [
        {
            name: 'keys',
            type: 'array',
            modelType: 'service-account-keys'
        }
    ];
    constructor(data) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.email = data?.attributes?.email ?? '';
        this.enabled = data?.attributes?.enabled ?? false;
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new ServiceAccount(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
