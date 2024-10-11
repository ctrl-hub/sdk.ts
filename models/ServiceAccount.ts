import { ModelInterface } from "../interfaces/ModelInterface";
import {ServiceAccountKey} from "./ServiceAccountKey";

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

        serviceAccount.relationships = data.relationships || {};
        const included = fullResponseData.included || [];

        // if (included.length > 0) {
        //     included.forEach((item: any) => {
        //         if (item.type === 'service-account-keys') {
        //             let serviceAccountKey = {
        //                 id: item.id,
        //                 type: item.type,
        //                 attributes: {
        //                     client_id: item.attributes.client_id || ''
        //                 }
        //             }
        //
        //             console.log(ServiceAccountKey.hydrate(serviceAccountKey, fullResponseData));
        //
        //             // serviceAccount.included.push(item);
        //         }
        //     });
        // }

        return serviceAccount;

    }

}