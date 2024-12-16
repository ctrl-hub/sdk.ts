import type { Model } from "../types/Model";
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

type FieldMapping = {
    from: string;
    to: string;
};

@RegisterModel
export class Form implements Model {
    public id: string = '';
    public type: string = 'forms';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public name: string = '';
    public description: string = '';
    public field_mappings: FieldMapping[] = [];
    public status: string = '';
    public formType: string = '';

    static relationships: RelationshipDefinition[] = [];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.name = data?.attributes?.name ?? '';
        this.description = data?.attributes?.description ?? '';
        this.field_mappings = data?.attributes?.field_mappings ?? [];
        this.status = data?.attributes?.status ?? '';
        this.formType = data?.attributes?.type ?? '';

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Form {
        return new Form(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
