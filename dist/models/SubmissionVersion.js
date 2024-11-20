export class SubmissionVersion {
    id = '';
    type = 'submission-versions';
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
        let submissionVersion = new SubmissionVersion();
        if (data) {
            submissionVersion.id = data.id || '';
            submissionVersion.type = data.type || 'submissions';
            submissionVersion.attributes.author = data.attributes.author || '';
            submissionVersion.attributes.form = data.attributes.form || '';
            submissionVersion.attributes.form_version = data.attributes.form_version || '';
            submissionVersion.attributes.reference = data.attributes.reference || '';
            submissionVersion.attributes.status = data.attributes.status || '';
            submissionVersion.meta = data.meta || {};
            submissionVersion.links = data.links || {};
            submissionVersion.relationships = data.relationships || {};
        }
        return submissionVersion;
    }
}
