import { BaseModel } from './BaseModel';
export class Permission extends BaseModel {
    type = 'permissions';
    description = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.description = data?.attributes?.description ?? '';
    }
}
