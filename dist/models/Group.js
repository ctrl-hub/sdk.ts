import { BaseModel } from '@models/BaseModel';
export class Group extends BaseModel {
    type = 'groups';
    name = '';
    description = '';
    bindings = [];
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.bindings = data?.attributes?.bindings ?? [];
    }
    jsonApiMapping() {
        return {
            attributes: ['name', 'description'],
            relationships: {},
        };
    }
}
