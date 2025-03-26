export class BaseModel {
    id = '';
    type = '';
    meta;
    links;
    included;
    _relationships;
    static relationships = [];
    constructor(data) {
        this.id = data?.id ?? '';
        this.type = data?.type ?? '';
        // Only set optional properties if they have content
        if (data?.meta && Object.keys(data.meta).length > 0) {
            this.meta = data.meta;
        }
        if (data?.links && Object.keys(data.links).length > 0) {
            this.links = data.links;
        }
        if (data?.included && Object.keys(data.included).length > 0) {
            this.included = data.included;
        }
        if (data?.relationships && Object.keys(data.relationships).length > 0) {
            this._relationships = data.relationships;
        }
    }
    toJSON() {
        const obj = {};
        console.log(this);
        if (this.id)
            obj.id = this.id;
        if (this.type)
            obj.type = this.type;
        if (this.meta)
            obj.meta = this.meta;
        if (this.links)
            obj.links = this.links;
        for (const [key, value] of Object.entries(this)) {
            // Skip the base properties already handled
            if (['id', 'type', 'meta', 'links', 'included', '_relationships'].includes(key)) {
                continue;
            }
            if (value !== null && value !== undefined) {
                if (typeof value === 'object' && Object.keys(value).length === 0) {
                    continue;
                }
                obj[key] = value;
            }
        }
        return obj;
    }
}
