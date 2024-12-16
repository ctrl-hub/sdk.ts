import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

@RegisterModel
export class ServiceAccount implements Model {
    public id: string = '';
    public type: string = 'service-accounts';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public name: string = '';
    public description: string = '';
    public email: string = '';
    public enabled: boolean = false;

    static relationships: RelationshipDefinition[] = [
        {
            name: 'keys',
            type: 'array',
            modelType: 'service-account-keys'
        }
    ];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.email = data?.attributes?.email ?? '';
        this.enabled = data?.attributes?.enabled ?? false;

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): ServiceAccount {
        return new ServiceAccount(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}