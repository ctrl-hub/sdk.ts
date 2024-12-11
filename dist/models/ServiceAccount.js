import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class ServiceAccount {
    id = '';
    type = 'service-accounts';
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
            email: data?.attributes?.email ?? '',
            enabled: data?.attributes?.enabled ?? false,
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new ServiceAccount(data);
    }
}
