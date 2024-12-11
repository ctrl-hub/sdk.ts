import type { Model } from '../types/Model';
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
    public included?: any;

    constructor(data?: Submission) {
        this.id = data?.id ?? '';
        this.attributes = {
            reference: data?.attributes?.reference ?? '',
            status: data?.attributes?.status ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Submission {
        return new Submission(data);
    }
}
