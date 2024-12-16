import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class Form extends BaseModel {
    type = 'forms';
    name = '';
    description = '';
    field_mappings = [];
    status = '';
    formType = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.field_mappings = data?.attributes?.field_mappings ?? [];
        this.status = data?.attributes?.status ?? '';
        this.formType = data?.attributes?.type ?? '';
    }
    static hydrate(data) {
        return new Form(data);
    }
}
