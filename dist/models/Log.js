export class Log {
    id = '';
    type = 'logs';
    attributes;
    meta = {};
    relationships;
    links;
    constructor() {
        // Default initialization of attributes
        this.attributes = {
            actor: {
                type: '',
                id: ''
            },
            duration: 0,
            request: {
                time: '',
                headers: {},
                body: '',
                path: '',
                query: {},
                raw_query: '',
                method: '',
                content_length: 0,
            },
            response: {
                time: '',
                body: '',
                headers: {},
                status: 0,
            }
        };
        this.relationships = [];
        this.links = {};
    }
    // Static method to "hydrate" the Log object with data
    static hydrate(data, fullResponseData) {
        let log = new Log();
        if (data) {
            log.id = data.id;
            log.attributes.actor = data.attributes.actor || { type: '', id: '' };
            log.attributes.duration = data.attributes.duration || 0;
            log.attributes.request = data.attributes.request || {
                time: '',
                headers: {},
                body: '',
                path: '',
                query: {},
                raw_query: '',
                method: '',
                content_length: 0
            };
            log.attributes.response = data.attributes.response || {
                time: '',
                body: '',
                headers: {},
                status: 0
            };
            log.meta = data.meta || {};
            log.links = data.links || {};
        }
        return log;
    }
}
