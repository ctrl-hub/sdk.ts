import { BaseModel } from '@models/BaseModel';
export class Form extends BaseModel {
    type = 'forms';
    name = '';
    description = '';
    fieldMappings = [];
    status = '';
    formType = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.fieldMappings = data?.attributes?.field_mappings ?? [];
        this.status = data?.attributes?.status ?? '';
        this.formType = data?.attributes?.type ?? '';
    }
}
