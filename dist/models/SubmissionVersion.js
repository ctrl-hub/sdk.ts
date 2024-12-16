import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class SubmissionVersion {
    id = '';
    type = 'submission-versions';
    meta = {};
    links = {};
    _relationships;
    included;
    author = '';
    form = '';
    form_version = '';
    reference = '';
    status = '';
    content = {};
    static relationships = [];
    constructor(data) {
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
    static hydrate(data) {
        return new SubmissionVersion(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
