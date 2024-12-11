import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class SubmissionVersion {
    id = '';
    type = 'submission-versions';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
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
    static hydrate(data) {
        return new SubmissionVersion(data);
    }
}
