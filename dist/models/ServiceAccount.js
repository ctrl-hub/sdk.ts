import { Client } from "@services/Client";
export class ServiceAccount {
    id = '';
    type = 'service-accounts';
    attributes;
    meta = {};
    relationships;
    links;
    constructor() {
        this.attributes = {
            name: '',
            description: '',
            email: '',
            enabled: false,
        };
    }
    async addKey(config) {
        let client = new Client(config);
        let endpoint = client.finalEndpoint(client.services['serviceAccounts']);
        return await client.makePostRequest(endpoint + '/' + this.id + '/keys', {
            data: {
                type: 'service-account-keys'
            }
        });
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
