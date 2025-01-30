import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class Scheme extends BaseModel {
    public type: string = 'schemes';

    public name: string = '';
    public code: string = '';
    public description: string = '';
    public status: string = '';
    public start_date: string = '';
    public end_date: string = '';

    static relationships: RelationshipDefinition[] = [
        {
            name: 'work_orders',
            type: 'array',
            modelType: 'work-orders',
        },
    ];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.code = data?.attributes?.code ?? data?.code ?? '';
        this.description = data?.attributes?.description ?? data?.description ?? '';
        this.status = data?.attributes?.status ?? data?.description ?? '';
        this.start_date = data?.attributes?.start_date ?? data?.description ?? '';
        this.end_date = data?.attributes?.end_date ?? data?.description ?? '';
    }

    jsonApiMapping() {
        return {
            attributes: ['name', 'code', 'description', 'status', 'start_date', 'end_date'],
        };
    }
}
