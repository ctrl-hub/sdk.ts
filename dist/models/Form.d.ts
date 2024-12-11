import type { Model } from "../types/Model";
type FieldMapping = {
    from: string;
    to: string;
};
type FormAttributes = {
    name: string;
    description: string;
    field_mappings: FieldMapping[];
    status: string;
    type: string;
};
export declare class Form implements Model {
    id: string;
    type: string;
    attributes: FormAttributes;
    meta: any;
    links: any;
    relationships?: any;
    included?: any;
    constructor(data?: Form);
    static hydrate(data: any): Form;
}
export {};
