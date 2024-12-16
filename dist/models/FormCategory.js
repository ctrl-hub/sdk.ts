import { RegisterModel } from '../utils/ModelRegistry';
import { BaseModel } from '@models/BaseModel';
@RegisterModel
export class FormCategory extends BaseModel {
    type = 'form_categories';
    name = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
    static hydrate(data) {
        return new FormCategory(data);
    }
}
