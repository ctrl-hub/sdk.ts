import type { Model } from '../types/Model';
import { RegisterModel } from '../utils/ModelRegistry';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';

@RegisterModel
export class Submission implements Model {
    public id: string = '';
    public type: string = 'submissions';
    public meta: any = {};
    public links: any = {};
    public _relationships?: any;
    public included?: any;

    public reference: string = '';
    public status: string = '';

    static relationships: RelationshipDefinition[] = [
        {
            name: 'form',
            type: 'single',
            modelType: 'forms'
        },
        {
            name: 'form_version',
            type: 'single',
            modelType: 'form-versions'
        },
    ];

    constructor(data?: any) {
        this.id = data?.id ?? '';
        this.type = data?.type ?? 'submissions';
        this.reference = data?.attributes?.reference ?? '';
        this.status = data?.attributes?.status ?? '';

        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }

    static hydrate(data: any): Submission {
        return new Submission(data);
    }

    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
