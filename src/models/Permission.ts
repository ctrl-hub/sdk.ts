import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

type PermissionAttributes = {
    description: string;
};

@RegisterModel
export class Permission implements Model {
    public id: string = '';
    public type: string = 'roles';
    public attributes: PermissionAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;
    public included?: any;

    constructor(data?: Permission) {
        this.id = data?.id ?? '';
        this.attributes = {
            description: data?.attributes?.description ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Permission {
        return new Permission(data);
    }
}
