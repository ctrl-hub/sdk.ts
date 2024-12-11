import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

type Attributes = {
    client_id: string;
    enabled: boolean;
};

@RegisterModel
export class ServiceAccountKey implements Model {
    public id: string = '';
    public type: string = 'service-account-keys';
    public attributes: Attributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;
    public included?: any;

    constructor(data?: ServiceAccountKey) {
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

    static hydrate(data: any): ServiceAccountKey {
        return new ServiceAccountKey(data);
    }
}
