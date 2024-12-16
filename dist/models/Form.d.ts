import type { Model } from "../types/Model";
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
type FieldMapping = {
    from: string;
    to: string;
};
export declare class Form implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    _relationships?: any;
    included?: any;
    name: string;
    description: string;
    field_mappings: FieldMapping[];
    status: string;
    formType: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): Form;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}
export {};
