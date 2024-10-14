export class ServiceAccountKey {
    id = '';
    type = 'service-account-keys';
    attributes;
    meta = {};
    relationships;
    links;
    constructor() {
        this.attributes = {
            client_id: '',
        };
        this.relationships = [];
    }
    static hydrate(data, fullResponseData) {
        let serviceAccountKey = new ServiceAccountKey();
        if (data) {
            serviceAccountKey.id = data.id;
            serviceAccountKey.attributes.client_id = data.attributes.client_id || '';
            serviceAccountKey.meta = data.meta || {};
        }
        return serviceAccountKey;
    }
}
