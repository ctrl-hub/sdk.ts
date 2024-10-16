export class Form {
    id = '';
    type = 'forms';
    attributes;
    meta = {};
    links = {};
    constructor() {
        this.attributes = {
            name: '',
            description: '',
            field_mappings: [],
            status: ''
        };
    }
    static hydrate(data) {
        let form = new Form();
        if (data) {
            form.id = data.id || '';
            form.type = data.type || 'forms';
            form.attributes.name = data.attributes.name || '';
            form.attributes.description = data.attributes.description || '';
            form.attributes.field_mappings = data.attributes.field_mappings || [];
            form.attributes.status = data.attributes.status || '';
            form.meta = data.meta || {};
            form.links = data.links || {};
        }
        return form;
    }
}
