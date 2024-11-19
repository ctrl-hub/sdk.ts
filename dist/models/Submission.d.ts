import type { Model } from "../types/Model";
type SubmissionAttributes = {
    author: string;
    form: string;
    form_version: string;
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
    constructor();
    static hydrate(data: any): Submission;
}
export {};
