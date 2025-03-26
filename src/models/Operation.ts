import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { Label } from './Label';

export class Operation extends BaseModel {
    public type: string = 'operations';

    public name: string = '';
    public code: string = '';
    public description: string = '';
    public start_date: string = '';
    public end_date: string = '';
    public labels: Array<Label> = [];
    public uprns: Array<string> = [];
    public usrns: Array<string> = [];
    public completed: boolean = false;
    public aborted: boolean = false;
    public cancelled: boolean = false;

    static relationships: RelationshipDefinition[] = [
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
        {
            name: 'assignees',
            type: 'array',
            modelType: 'users',
        },
        {
            name: 'teams',
            type: 'array',
            modelType: 'teams',
        },
        {
            name: 'template',
            type: 'single',
            modelType: 'operation-templates',
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
