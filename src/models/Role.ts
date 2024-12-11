import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

type RoleAttributes = {
    custom: boolean;
    name: string;
    description: string;
    launch_stage: string;
    permissions: string[];
};

@RegisterModel
export class Role implements Model {
    public id: string = '';
    public type: string = 'roles';
    public attributes: RoleAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;
    public included?: any;

    constructor(data?: Role) {
        this.id = data?.id ?? '';
        this.attributes = {
            custom: data?.attributes?.custom ?? false,
            name: data?.attributes?.name ?? '',
            description: data?.attributes?.description ?? '',
            launch_stage: data?.attributes?.launch_stage ?? '',
            permissions: data?.attributes?.permissions ?? [],
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Role {
        return new Role(data);
    }
}
