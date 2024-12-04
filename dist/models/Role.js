import { RegisterModel } from '../utils/ModelRegistry';
@RegisterModel
export class Role {
    id = "";
    type = "roles";
    attributes;
    meta = {};
    links;
    constructor() {
        this.attributes = {
            custom: false,
            name: "",
            description: "",
            launch_stage: "",
            permissions: [],
        };
    }
    static hydrate(data) {
        let role = new Role();
        if (data) {
            role.id = data.id;
            role.attributes.custom = data.attributes.custom || false;
            role.attributes.name = data.attributes.name || "";
            role.attributes.description = data.attributes.description || "";
            role.attributes.launch_stage = data.attributes.launch_stage || "";
            role.attributes.permissions = data.attributes.permissions || [];
            role.meta = data.meta || {};
        }
        return role;
    }
}
