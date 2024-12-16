import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Log {
    id = '';
    type = 'logs';
    meta = {};
    links = {};
    _relationships;
    included;
    actor;
    duration;
    request;
    response;
    static relationships = [];
    constructor(data) {
        this.id = data?.id ?? '';
        this.actor = data?.attributes?.actor ?? { type: '', id: '' };
        this.duration = data?.attributes?.duration ?? 0;
        this.request = data?.attributes?.request ?? {
            time: '',
            headers: {},
            body: '',
            path: '',
            query: {},
            raw_query: '',
            method: '',
            content_length: 0
        };
        this.response = data?.attributes?.response ?? {
            time: '',
            body: '',
            headers: {},
            status: 0
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this._relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Log(data);
    }
    toJSON() {
        const { _relationships, ...rest } = this;
        return rest;
    }
}
