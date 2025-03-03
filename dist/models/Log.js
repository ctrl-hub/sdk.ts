import { BaseModel } from './BaseModel';
export class Log extends BaseModel {
    type = 'logs';
    actor;
    duration;
    request;
    response;
    static relationships = [];
    constructor(data) {
        super(data);
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
    }
}
