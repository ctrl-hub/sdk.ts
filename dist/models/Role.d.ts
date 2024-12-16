import type { Model } from '../types/Model';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
export declare class Role implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    _relationships?: any;
    included?: any;
    custom: boolean;
    name: string;
    description: string;
    launch_stage: string;
    permissions: string[];
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): Role;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}
