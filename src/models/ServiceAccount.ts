import type { Model } from "../types/Model";
import {Client} from "@services/Client";
import {ClientConfig} from "@services/ClientConfig";

type ServiceAccountAttributes = {
    name: string;
    description: string;
    email: string;
    enabled: boolean;
};

export class ServiceAccount implements Model {
    public id: string = '';
    public type: string = 'service-accounts';
    public attributes: ServiceAccountAttributes;
    public meta: any = {};
    public relationships? : any;
    links: any;

    constructor() {
        this.attributes = {
            name: '',
            description: '',
            email: '',
            enabled: false,
        }
    }

    async addKey(config: ClientConfig) {
        let client = new Client(config);
        let endpoint = client.finalEndpoint(client.services['serviceAccounts']);
        return await client.makePostRequest(endpoint + '/' + this.id + '/keys', {
            data: {
                type: 'service-account-keys'
            }
        });
    }

    static hydrate(data: any, fullResponseData: any) {
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