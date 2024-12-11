import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';

type FormCategoryAttributes = {
    name: string;
};

@RegisterModel
export class FormCategory implements Model {
    public id: string = '';
    public type: string = 'form-categories';
    public attributes: FormCategoryAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: {};
    public included?: any;

    constructor(data?: FormCategory) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any) {
        let formCategory = new FormCategory();

        if (data) {
            formCategory.id = data.id;
            formCategory.attributes.name = data.attributes.name || '';
            formCategory.meta = data.meta || {};
        }

        return formCategory;
    }
}
