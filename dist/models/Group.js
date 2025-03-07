import { BaseModel } from './BaseModel';
export class Group extends BaseModel {
    type = 'groups';
    name = '';
    description = '';
    bindings = [];
    static relationships = [
        {
            name: 'users',
            type: 'array',
            modelType: 'users',
        },
    ];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.bindings = data?.attributes?.bindings ?? data?.bindings ?? [];
    }
    jsonApiMapping() {
        return {
            attributes: ['name', 'description', 'bindings'],
            relationships: {},
        };
    }
}
