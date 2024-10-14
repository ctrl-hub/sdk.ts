import type { Model } from "../types/Model";
type FormCategoryAttributes = {
    name: string;
};
export declare class FormCategory implements Model {
    id: string;
    type: string;
    attributes: FormCategoryAttributes;
    meta: any;
    links: any;
    constructor();
    static hydrate(data: any): FormCategory;
}
export {};
//# sourceMappingURL=FormCategory.d.ts.map