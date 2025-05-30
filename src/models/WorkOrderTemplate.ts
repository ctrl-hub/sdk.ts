import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { Label } from './Label';

export class WorkOrderTemplate extends BaseModel {
    public type: string = 'work-order-templates';

    public name: string = '';
    public labels: Label[] = [];

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.labels = data?.attributes?.labels ?? data?.labels ?? [];
    }

    jsonApiMapping() {
        return {
            attributes: ['name', 'labels'],
        };
    }
}
