import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';

type SubmissionAttributes = {
    reference: string;
    status: string;
};

@RegisterModel
export class Submission implements Model {
    public id: string = '';
    public type: string = 'submissions';
    public attributes: SubmissionAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;

    constructor() {
        this.attributes = {
            reference: '',
            status: '',
        };
    }

    static hydrate(data: any) {
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