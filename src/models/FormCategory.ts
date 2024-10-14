import type {Model} from "../types/Model";

type FormCategoryAttributes = {
    name: string;
};

export class FormCategory implements Model {
    public id: string = '';
    public type: string = 'form-categories';
    public attributes: FormCategoryAttributes;
    public meta: any = {};
    links: any;

    constructor() {
        this.attributes = {
            name: '',
        };
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