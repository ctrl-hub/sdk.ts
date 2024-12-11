import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Form {
    id = '';
    type = 'forms';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
            description: data?.attributes?.description ?? '',
            field_mappings: data?.attributes?.field_mappings ?? [],
            status: data?.attributes?.status ?? '',
            type: data?.attributes?.type ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Form(data);
    }
}
