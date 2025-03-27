import { BaseModel } from './BaseModel';
export class WorkOrderTemplate extends BaseModel {
    type = 'work-order-templates';
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
