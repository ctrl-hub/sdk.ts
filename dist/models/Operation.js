import { BaseModel } from './BaseModel';
export class Operation extends BaseModel {
    type = 'operations';
    name = '';
    code = '';
    description = '';
    start_date = '';
    end_date = '';
    labels = [];
    uprns = [];
    usrns = [];
    completed = false;
    aborted = false;
    cancelled = false;
    static relationships = [
        {
            name: 'properties',
            type: 'array',
            modelType: 'properties',
        },
        {
            name: 'streets',
            type: 'array',
            modelType: 'streets',
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
        this.uprns = data?.attributes?.uprns ?? data?.uprns ?? [];
        this.usrns = data?.attributes?.usrns ?? data?.usrns ?? [];
        this.completed = data?.attributes?.completed ?? data?.completed ?? false;
        this.aborted = data?.attributes?.aborted ?? data?.aborted ?? false;
        this.cancelled = data?.attributes?.cancelled ?? data?.cancelled ?? false;
    }
    jsonApiMapping() {
        return {
            attributes: ['name', 'code', 'description', 'start_date', 'end_date', 'labels', 'uprns', 'usrns', 'completed', 'aborted', 'cancelled'],
        };
    }
}
