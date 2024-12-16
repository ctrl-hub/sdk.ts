import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

@RegisterModel
export class SubmissionVersion implements Model {
    public id: string = '';
    public type: string = 'submission-versions';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public author: string = '';
    public form: string = '';
    public form_version: string = '';
    public reference: string = '';
    public status: string = '';
    public content: object = {};

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.author = data?.attributes?.author ?? '';
        this.form = data?.attributes?.form ?? '';
        this.form_version = data?.attributes?.form_version ?? '';
        this.reference = data?.attributes?.reference ?? '';
        this.status = data?.attributes?.status ?? '';
        this.content = data?.attributes?.content ?? {};

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): SubmissionVersion {
        return new SubmissionVersion(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
