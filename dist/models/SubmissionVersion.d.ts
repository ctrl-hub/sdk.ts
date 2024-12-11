import type { Model } from '../types/Model';
type SubmissionVersionAttributes = {
    author: string;
    form: string;
    form_version: string;
    reference: string;
    status: string;
    content: object;
};
export declare class SubmissionVersion implements Model {
    id: string;
    type: string;
    attributes: SubmissionVersionAttributes;
    meta: any;
    links: any;
    relationships?: any;
    included?: any;
    constructor(data?: SubmissionVersion);
    static hydrate(data: any): SubmissionVersion;
}
export {};
