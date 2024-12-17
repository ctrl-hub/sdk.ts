import type { RelationshipDefinition } from '../types/RelationshipDefinition';
import { BaseModel } from '@models/BaseModel';

export class SubmissionVersion extends BaseModel {
    public type: string = 'submission-versions';

    public author: string = '';
    public form: string = '';
    public form_version: string = '';
    public reference: string = '';
    public status: string = '';
    public content: object = {};

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        super(data);
        this.author = data?.attributes?.author ?? '';
        this.form = data?.attributes?.form ?? '';
        this.form_version = data?.attributes?.form_version ?? '';
        this.reference = data?.attributes?.reference ?? '';
        this.status = data?.attributes?.status ?? '';
        this.content = data?.attributes?.content ?? {};
    }

}
