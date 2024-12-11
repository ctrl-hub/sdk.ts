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
    public included?: any;

    constructor(data?: Form) {
        this.id = data?.id ?? '';
        this.attributes = {
            name: data?.attributes?.name ?? '',
            description: data?.attributes?.description ?? '',
            field_mappings: data?.attributes?.field_mappings ?? [],
            status: data?.attributes?.status ?? '',
            type: data?.attributes?.type ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Form {
        return new Form(data);
    }
}
