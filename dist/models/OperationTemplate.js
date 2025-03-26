import { BaseModel } from './BaseModel';
export class OperationTemplate extends BaseModel {
    type = 'operation-templates';
    name = '';
    labels = [];
    requirements = { forms: [] };
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.labels = data?.attributes?.labels ?? data?.labels ?? [];
        this.requirements = data?.attributes?.requirements ?? data?.requirements ?? { forms: [] };
    }
    jsonApiMapping() {
        return {
            attributes: ['name', 'labels', 'requirements'],
        };
    }
}
