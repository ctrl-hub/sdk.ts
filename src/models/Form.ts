import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

type FieldMapping = {
    from: string;
    to: string;
};

@RegisterModel
export class Form extends BaseModel {
    public type: string = 'forms';

    public name: string = '';
    public description: string = '';
    public field_mappings: FieldMapping[] = [];
    public status: string = '';
    public formType: string = '';

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.field_mappings = data?.attributes?.field_mappings ?? [];
        this.status = data?.attributes?.status ?? '';
        this.formType = data?.attributes?.type ?? '';
    }

    static hydrate(data: any): Form {
        return new Form(data);
    }
}
