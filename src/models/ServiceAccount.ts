import type { Model } from "../types/Model";

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
            enabled: false
        };
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