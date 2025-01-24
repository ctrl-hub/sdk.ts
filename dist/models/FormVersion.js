import { BaseModel } from '@models/BaseModel';
export class FormVersion extends BaseModel {
    type = 'form-version';
    name = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? '';
    }
}
