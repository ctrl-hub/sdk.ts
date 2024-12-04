import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';

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

@RegisterModel
export class Form implements Model {
    public id: string = '';
    public type: string = 'forms';
    public attributes: FormAttributes;
    public meta: any = {};
    public links: any = {};
    public relationships?: any;

    constructor() {
        this.attributes = {
            name: '',
            description: '',
            field_mappings: [],
            status: '',
            type: '',
        };
    }

    static hydrate(data: any) {
        let form = new Form();

        if (data) {
            form.id = data.id || '';
            form.type = data.type || 'forms';
            form.relationships = data.relationships || {};
            form.attributes.name = data.attributes.name || '';
            form.attributes.description = data.attributes.description || '';
            form.attributes.field_mappings = data.attributes.field_mappings || [];
            form.attributes.type = data.attributes.type || '';
            form.attributes.status = data.attributes.status || '';
            form.meta = data.meta || {};
            form.links = data.links || {};
        }

        return form;
    }
}