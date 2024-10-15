"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormCategory = void 0;
class FormCategory {
    id = '';
    type = 'form-categories';
    attributes;
    meta = {};
    links;
    constructor() {
        this.attributes = {
            name: '',
        };
    }
    static hydrate(data) {
        let formCategory = new FormCategory();
        if (data) {
            formCategory.id = data.id;
            formCategory.attributes.name = data.attributes.name || '';
            formCategory.meta = data.meta || {};
        }
        return formCategory;
    }
}
exports.FormCategory = FormCategory;
