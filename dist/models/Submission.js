export class Submission {
    id = '';
    type = 'submissions';
    attributes;
    meta = {};
    links = {};
    relationships;
    constructor() {
        this.attributes = {
            reference: '',
            status: '',
        };
    }
    static hydrate(data) {
        let submission = new Submission();
        if (data) {
            submission.id = data.id || '';
            submission.type = data.type || 'submissions';
            submission.relationships = data.relationships || {};
            submission.attributes.reference = data.attributes.reference || '';
            submission.attributes.status = data.attributes.status || '';
            submission.meta = data.meta || {};
            submission.links = data.links || {};
        }
        return submission;
    }
}
