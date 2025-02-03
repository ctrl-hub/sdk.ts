import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { JsonApiMapping } from '../types/JsonApiMapping';

export class Scheme extends BaseModel implements Partial<JsonApiMapping> {
    public type: string = 'schemes';

    public name: string = '';
    public code: string = '';
    public description: string = '';
    public status: string = '';
    public start_date?: Date;
    public end_date?: Date;

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
