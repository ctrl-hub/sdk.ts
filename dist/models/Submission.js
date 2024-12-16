import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Submission {
    id = '';
    type = 'submissions';
    meta = {};
    links = {};
    _relationships;
    included;
    reference = '';
    status = '';
    static relationships = [
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
    constructor(data) {
        this.id = data?.id ?? '';
        this.type = data?.type ?? 'submissions';
        this.reference = data?.attributes?.reference ?? '';
        this.status = data?.attributes?.status ?? '';
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Submission(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
