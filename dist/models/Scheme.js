import { BaseModel } from '@models/BaseModel';
export class Scheme extends BaseModel {
    type = 'schemes';
    name = '';
    code = '';
    description = '';
    start_date = '';
    end_date = '';
    labels = [];
    static relationships = [
        {
            name: 'work_orders',
            type: 'array',
            modelType: 'work-orders',
        },
    ];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.code = data?.attributes?.code ?? data?.code ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.start_date = data?.attributes?.start_date ?? data?.start_date ?? '';
        this.end_date = data?.attributes?.end_date ?? data?.end_date ?? '';
        this.labels = data?.attributes?.labels ?? data?.labels ?? [];
    }
    jsonApiMapping() {
        return {
            attributes: ['name', 'code', 'description', 'start_date', 'end_date', 'labels'],
        };
    }
}
