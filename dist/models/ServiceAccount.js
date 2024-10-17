export class ServiceAccount {
    id;
    type = 'service-accounts';
    attributes;
    meta = {};
    relationships;
    links;
    constructor() {
        this.attributes = {};
    }
    static hydrate(data, fullResponseData) {
        let serviceAccount = new ServiceAccount();
        if (data) {
            serviceAccount.id = data.id;
            serviceAccount.attributes.name = data.attributes.name || '';
            serviceAccount.attributes.description = data.attributes.description || '';
            serviceAccount.attributes.email = data.attributes.email || '';
            serviceAccount.attributes.enabled = data.attributes.enabled || false;
            serviceAccount.meta = data.meta || {};
            serviceAccount.relationships = data.relationships || {};
        }
        return serviceAccount;
    }
}
