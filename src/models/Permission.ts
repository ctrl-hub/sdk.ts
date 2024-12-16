import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

@RegisterModel
export class Permission implements Model {
    public id: string = '';
    public type: string = 'permissions';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public description: string = '';

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.description = data?.attributes?.description ?? '';
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Permission {
        return new Permission(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}