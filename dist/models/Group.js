import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class Group extends BaseModel {
    type = 'groups';
    name = '';
    description = '';
    bindings = [];
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.bindings = data?.attributes?.bindings ?? [];
    }
}
