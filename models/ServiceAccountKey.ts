import { ModelInterface } from "../interfaces/ModelInterface";

type Attributes = {
    client_id: string;
};

export class ServiceAccountKey implements ModelInterface {
    public id: string = '';
    public type: string = 'service-account-keys';
    public attributes: Attributes;
    public meta: any = {};
    relationships: any[];

    constructor() {
        this.attributes = {
            client_id: '',
        };
    }

    static hydrate(data: any, fullResponseData: any) {
        let ServiceAccountKey = new ServiceAccountKey();

        if (data) {
            ServiceAccountKey.id = data.id;
            ServiceAccountKey.attributes.client_id = data.name || '';
        }

        return ServiceAccountKey;
    }

}