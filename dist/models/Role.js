import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Role {
    id = '';
    type = 'roles';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
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
    static hydrate(data) {
        return new Role(data);
    }
}
