import { BaseModel } from '@models/BaseModel';
export class WorkOrder extends BaseModel {
    type = 'work-orders';
    name = '';
    code = '';
    description = '';
    status = '';
    start_date = '';
    end_date = '';
    labels = [];
    uprns = [];
    usrns = [];
    static relationships = [
        {
            name: 'operations',
            type: 'array',
            modelType: 'operations',
        },
    ];
    constructor(data) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.code = data?.attributes?.code ?? data?.code ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.status = data?.attributes?.status ?? data?.status ?? '';
        this.start_date = data?.attributes?.start_date ?? data?.start_date ?? '';
        this.end_date = data?.attributes?.end_date ?? data?.end_date ?? '';
        this.labels = data?.attributes?.labels ?? data?.labels ?? [];
        this.uprns = data?.attributes?.uprns ?? data?.uprns ?? [];
        this.usrns = data?.attributes?.usrns ?? data?.usrns ?? [];
    }
    jsonApiMapping() {
        return {
            attributes: ['name', 'code', 'description', 'status', 'start_date', 'end_date', 'labels'],
        };
    }
}
