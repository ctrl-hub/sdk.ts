import type { Model } from '../types/Model';
type FormCategoryAttributes = {
    name: string;
};
export declare class FormCategory implements Model {
    id: string;
    type: string;
    attributes: FormCategoryAttributes;
    meta: any;
    links: any;
    relationships?: {};
    included?: any;
    constructor(data?: FormCategory);
    static hydrate(data: any): FormCategory;
}
export {};
