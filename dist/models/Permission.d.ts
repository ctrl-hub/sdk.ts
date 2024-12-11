import type { Model } from '../types/Model';
type PermissionAttributes = {
    description: string;
};
export declare class Permission implements Model {
    id: string;
    type: string;
    attributes: PermissionAttributes;
    meta: any;
    links: any;
    relationships?: any;
    included?: any;
    constructor(data?: Permission);
    static hydrate(data: any): Permission;
}
export {};
