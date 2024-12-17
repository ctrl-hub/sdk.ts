import { BaseModel } from '@models/BaseModel';
export class FormCategory extends BaseModel {
    type = 'form_categories';
    name = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
}
