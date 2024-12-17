import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

@RegisterModel
export class Submission extends BaseModel {
    public type: string = 'submissions';

    public reference: string = '';
    public status: string = '';

    static relationships: RelationshipDefinition[] = [
        {
            name: 'form',
            type: 'single',
            modelType: 'forms'
        },
        {
            name: 'form_version',
            type: 'single',
            modelType: 'form-versions'
        },
    ];

    constructor(data?: any) {
        super(data);
        this.reference = data?.attributes?.reference ?? '';
        this.status = data?.attributes?.status ?? '';
    }

    static hydrate(data: any): Submission {
        return new Submission(data);
    }
}
