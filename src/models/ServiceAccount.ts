import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

type ServiceAccountAttributes = {
    name: string;
    description: string;
    email: string;
    enabled: boolean;
};

@RegisterModel
export class ServiceAccount implements Model {
    public id: string = '';
    public type: string = 'service-accounts';
    public attributes: ServiceAccountAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;
    public included?: any;

    constructor(data?: ServiceAccount) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
            description: data?.attributes?.description ?? '',
            email: data?.attributes?.email ?? '',
            enabled: data?.attributes?.enabled ?? false,
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): ServiceAccount {
        return new ServiceAccount(data);
    }
}
