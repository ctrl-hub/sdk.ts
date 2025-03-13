import { BaseModel } from './BaseModel';
export class FormCategory extends BaseModel {
    type = 'form-categories';
    name = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
}
