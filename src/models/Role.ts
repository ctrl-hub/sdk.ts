import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

@RegisterModel
export class Role implements Model {
    public id: string = '';
    public type: string = 'roles';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public custom: boolean = false;
    public name: string = '';
    public description: string = '';
    public launch_stage: string = '';
    public permissions: string[] = [];

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.custom = data?.attributes?.custom ?? false;
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.launch_stage = data?.attributes?.launch_stage ?? '';
        this.permissions = data?.attributes?.permissions ?? [];

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Role {
        return new Role(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}