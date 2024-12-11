import type { Model } from '../types/Model';
type RoleAttributes = {
    custom: boolean;
    name: string;
    description: string;
    launch_stage: string;
    permissions: string[];
};
export declare class Role implements Model {
    id: string;
    type: string;
    attributes: RoleAttributes;
    meta: any;
    links: any;
    relationships?: any;
    included?: any;
    constructor(data?: Role);
    static hydrate(data: any): Role;
}
export {};
