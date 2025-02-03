import { BaseModel } from '@models/BaseModel';
export class Scheme extends BaseModel {
    type = 'schemes';
    name = '';
    code = '';
    description = '';
    status = '';
    start_date;
    end_date;
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
        this.status = data?.attributes?.status ?? data?.status ?? '';
        this.start_date = data?.attributes?.start_date ?? data?.start_date ?? '';
        this.end_date = data?.attributes?.end_date ?? data?.end_date ?? '';
    }
    jsonApiMapping() {
        return {
            attributes: ['name', 'code', 'description', 'status', 'start_date', 'end_date'],
            attributeCasts: {
                start_date: 'date',
                end_date: 'date',
            }
        };
    }
}
