import { ModelInterface } from "../interfaces/ModelInterface";

type ServiceAccountAttributes = {
    name: string;
    description: string;
    email: string;
    enabled: boolean;
};

export class ServiceAccount implements ModelInterface {
    public id: string = '';
    public type: string = 'service-accounts';
    public attributes: ServiceAccountAttributes;
    public meta: any = {};
    public relationships? : any;

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
        }

        return serviceAccount;

    }

}