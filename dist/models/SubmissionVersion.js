import { BaseModel } from './BaseModel';
export class SubmissionVersion extends BaseModel {
    type = 'submission-versions';
    author = '';
    form = '';
    form_version = '';
    reference = '';
    status = '';
    content = {};
    static relationships = [];
    constructor(data) {
        super(data);
        this.author = data?.attributes?.author ?? '';
        this.form = data?.attributes?.form ?? '';
        this.form_version = data?.attributes?.form_version ?? '';
        this.reference = data?.attributes?.reference ?? '';
        this.status = data?.attributes?.status ?? '';
        this.content = data?.attributes?.content ?? {};
    }
}
