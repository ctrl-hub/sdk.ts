import { BaseModel } from './BaseModel';
export class Permission extends BaseModel {
    type = 'permissions';
    name = '';
    description = '';
    category = '';
    component = '';
    verb = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.category = data?.attributes?.category ?? data?.category ?? '';
        this.component = data?.attributes?.component ?? data?.component ?? '';
        this.verb = data?.attributes?.verb ?? data?.verb;
    }
}
