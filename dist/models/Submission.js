export class Submission {
    id = '';
    type = 'submissions';
    attributes;
    meta = {};
    links = {};
    relationships;
    constructor() {
        this.attributes = {
            author: '',
            form: '',
            form_version: '',
            reference: '',
            status: '',
        };
    }
    static hydrate(data) {
        let submission = new Submission();
        if (data) {
            submission.id = data.id || '';
            submission.type = data.type || 'submissions';
            submission.attributes.author = data.attributes.author || '';
            submission.attributes.form = data.attributes.form || '';
            submission.attributes.form_version = data.attributes.form_version || '';
            submission.attributes.reference = data.attributes.reference || '';
            submission.attributes.status = data.attributes.status || '';
            submission.meta = data.meta || {};
            submission.links = data.links || {};
            submission.relationships = data.relationships || {};
        }
        return submission;
    }
}
