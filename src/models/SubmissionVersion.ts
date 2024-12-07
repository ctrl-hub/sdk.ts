import type { Model } from "../types/Model";
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

    constructor() {
        this.attributes = {
            author: '',
            form: '',
            form_version: '',
            reference: '',
            status: '',
            content: {},
        };
    }

    static hydrate(data: any) {
        let submissionVersion = new SubmissionVersion();

        if (data) {
            submissionVersion.id = data.id || '';
            submissionVersion.type = data.type || 'submissions';
            submissionVersion.attributes.author = data.attributes.author || '';
            submissionVersion.attributes.form = data.attributes.form || '';
            submissionVersion.attributes.form_version = data.attributes.form_version || '';
            submissionVersion.attributes.reference = data.attributes.reference || '';
            submissionVersion.attributes.status = data.attributes.status || '';
            submissionVersion.attributes.content = data.attributes.content || {};
            submissionVersion.meta = data.meta || {};
            submissionVersion.links = data.links || {};
            submissionVersion.relationships = data.relationships || {};
        }

        return submissionVersion;
    }
}