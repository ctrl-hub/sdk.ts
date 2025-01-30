import { BaseModel } from '@models/BaseModel';
export class Scheme extends BaseModel {
    type = 'schemes';
    name = '';
    code = '';
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.code = data?.attributes?.code ?? data?.code ?? '';
    }
    jsonApiMapping() {
        return {
            attributes: ['name', 'code'],
        };
    }
}
