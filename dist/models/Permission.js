import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Permission {
    id = "";
    type = "roles";
    attributes;
    meta = {};
    links;
    constructor() {
        this.attributes = {
            description: "",
        };
    }
    static hydrate(data) {
        let permission = new Permission();
        if (data) {
            permission.id = data.id;
            permission.attributes.description = data.attributes.description || "";
            permission.meta = data.meta || {};
        }
        return permission;
    }
}
