import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

type SubmissionVersionAttributes = {
    author: string;
    form: string;
    form_version: string;
    reference: string;
    status: string;
    content: object;
};

@RegisterModel
export class SubmissionVersion implements Model {
    public id: string = '';
    public type: string = 'submission-versions';
    public attributes: SubmissionVersionAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;
    public included?: any;

    constructor(data?: SubmissionVersion) {
        this.id = data?.id ?? '';
        this.attributes = {
            author: data?.attributes?.author ?? '',
            form: data?.attributes?.form ?? '',
            form_version: data?.attributes?.form_version ?? '',
            reference: data?.attributes?.reference ?? '',
            status: data?.attributes?.status ?? '',
            content: data?.attributes?.content ?? {},
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): SubmissionVersion {
        return new SubmissionVersion(data);
    }
}
