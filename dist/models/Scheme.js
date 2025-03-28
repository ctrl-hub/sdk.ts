import { BaseModel } from './BaseModel';
export class Scheme extends BaseModel {
    type = 'schemes';
    name = '';
    code = '';
    description = '';
    anticipated_start_date = '';
    anticipated_end_date = '';
    labels = [];
    static relationships = [
        {
            name: 'work_orders',
            type: 'array',
            modelType: 'work-orders',
        },
        {
            name: 'template',
            type: 'single',
            modelType: 'scheme-templates',
        }
    ];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.code = data?.attributes?.code ?? data?.code ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.anticipated_start_date = data?.attributes?.anticipated_start_date ?? data?.anticipated_start_date ?? '';
        this.anticipated_end_date = data?.attributes?.anticipated_end_date ?? data?.anticipated_end_date ?? '';
        this.labels = data?.attributes?.labels ?? data?.labels ?? [];
    }
    jsonApiMapping() {
        return {
            attributes: ['name', 'code', 'description', 'anticipated_start_date', 'anticipated_end_date', 'labels'],
        };
    }
}
