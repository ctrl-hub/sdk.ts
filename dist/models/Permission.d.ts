import type { Model } from "../types/Model";
type PermissionAttributes = {
    description: string;
};
export declare class Permission implements Model {
    id: string;
    type: string;
    attributes: PermissionAttributes;
    meta: any;
    links: any;
    constructor();
    static hydrate(data: any): Permission;
}
export {};
