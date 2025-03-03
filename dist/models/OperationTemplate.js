import { BaseModel } from './BaseModel';
export class OperationTemplate extends BaseModel {
    type = 'operation-templates';
    name = '';
    labels = [];
    static relationships = [];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.labels = data?.attributes?.labels ?? data?.labels ?? [];
    }
    jsonApiMapping() {
        return {
            attributes: ['name', 'labels'],
        };
    }
}
