import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Log {
    id = '';
    type = 'logs';
    attributes;
    meta = {};
    links = {};
    relationships;
    included;
    constructor(data) {
        this.id = data?.id ?? '';
        this.attributes = {
            actor: {
                type: data?.attributes?.actor?.type ?? '',
                id: data?.attributes?.actor?.id ?? '',
            },
            duration: data?.attributes?.duration ?? 0,
            request: {
                time: data?.attributes?.request?.time ?? '',
                headers: data?.attributes?.request?.headers ?? {},
                body: data?.attributes?.request?.body ?? '',
                path: data?.attributes?.request?.path ?? '',
                query: data?.attributes?.request?.query ?? {},
                raw_query: data?.attributes?.request?.raw_query ?? '',
                method: data?.attributes?.request?.method ?? '',
                content_length: data?.attributes?.request?.content_length ?? 0,
            },
            response: {
                time: data?.attributes?.response?.time ?? '',
                body: data?.attributes?.response?.body ?? '',
                headers: data?.attributes?.response?.headers ?? {},
                status: data?.attributes?.response?.status ?? 0,
            },
        };
        this.meta = data?.meta ?? {};
        this.links = data?.links ?? {};
        this.relationships = data?.relationships ?? {};
        this.included = data?.included ?? {};
    }
    static hydrate(data) {
        return new Log(data);
    }
}
