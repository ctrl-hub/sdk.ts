import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Submission {
    id = '';
    type = 'submissions';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
        this.id = data?.id ?? '';
        this.attributes = {
            reference: data?.attributes?.reference ?? '',
            status: data?.attributes?.status ?? '',
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Submission(data);
    }
}
