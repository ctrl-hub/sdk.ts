import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class ServiceAccountKey {
    id = '';
    type = 'service-account-keys';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
        this.id = data?.id ?? '';
        this.attributes = {
            client_id: data?.attributes?.client_id ?? '',
            enabled: data?.attributes?.enabled ?? false,
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new ServiceAccountKey(data);
    }
}
