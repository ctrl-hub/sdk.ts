import type { Model } from '../types/Model';
type SubmissionAttributes = {
    reference: string;
    status: string;
};
export declare class Submission implements Model {
    id: string;
    type: string;
    attributes: SubmissionAttributes;
    meta: any;
    links: any;
    relationships?: any;
    included?: any;
    constructor(data?: Submission);
    static hydrate(data: any): Submission;
}
export {};
