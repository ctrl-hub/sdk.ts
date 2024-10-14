import type { Model } from "../types/Model";

type Attributes = {
    client_id: string;
};

export class ServiceAccountKey implements Model {
    public id: string = '';
    public type: string = 'service-account-keys';
    public attributes: Attributes;
    public meta: any = {};
    relationships: any[];
    links: any;

    constructor() {
        this.attributes = {
            client_id: '',
        };
        this.relationships = [];
    }

    static hydrate(data: any, fullResponseData: any) {
        let serviceAccountKey = new ServiceAccountKey();

        if (data) {
            serviceAccountKey.id = data.id;
            serviceAccountKey.attributes.client_id = data.attributes.client_id || '';
            serviceAccountKey.meta = data.meta || {};
        }

        return serviceAccountKey;
    }

}