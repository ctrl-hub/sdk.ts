import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';
import type { Label } from './Label';

type Requirements = {
    forms: FormRequirement[]
}

class FormRequirement {
    public id: string = '';
    public required: boolean = false;
}

export class OperationTemplate extends BaseModel {
    public type: string = 'operation-templates';

    public name: string = '';
    public labels: Label[] = [];
    public requirements: Requirements = { forms: [] };

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? data?.name ?? '';
        this.labels = data?.attributes?.labels ?? data?.labels ?? [];
        this.requirements = data?.attributes?.requirements ?? data?.requirements ?? { forms: [] };
    }

    jsonApiMapping() {
        return {
            attributes: ['name', 'labels', 'requirements'],
        };
    }
}
