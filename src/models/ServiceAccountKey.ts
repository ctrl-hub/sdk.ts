import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

@RegisterModel
export class ServiceAccountKey implements Model {
    public id: string = '';
    public type: string = 'service-account-keys';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public client_id: string = '';
    public enabled: boolean = false;

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.client_id = data?.attributes?.client_id ?? '';
        this.enabled = data?.attributes?.enabled ?? false;

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): ServiceAccountKey {
        return new ServiceAccountKey(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}