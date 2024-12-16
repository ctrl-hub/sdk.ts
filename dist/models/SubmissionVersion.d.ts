import type { Model } from '../types/Model';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
export declare class SubmissionVersion implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    _relationships?: any;
    included?: any;
    author: string;
    form: string;
    form_version: string;
    reference: string;
    status: string;
    content: object;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): SubmissionVersion;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}
