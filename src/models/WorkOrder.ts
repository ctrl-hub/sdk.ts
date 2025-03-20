import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { Label } from './Label';

export class WorkOrder extends BaseModel {
    public type: string = 'work-orders';

    public name: string = '';
    public code: string = '';
    public description: string = '';
    public anticipated_start_date: string = '';
    public anticipated_end_date: string = '';
    public labels: Array<Label> = [];

    static relationships: RelationshipDefinition[] = [
        {
            name: 'operations',
            type: 'array',
            modelType: 'operations',
        },
    ];

    constructor(data?: any) {
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
