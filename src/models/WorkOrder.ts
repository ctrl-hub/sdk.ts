import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { Label } from './Label';

export class WorkOrder extends BaseModel {
    public type: string = 'work-orders';

    public name: string = '';
    public code: string = '';
    public description: string = '';
    public start_date: string = '';
    public end_date: string = '';
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
