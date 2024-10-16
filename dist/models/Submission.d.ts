import type { Model } from "../types/Model";
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
    constructor();
    static hydrate(data: any): Submission;
}
export {};
