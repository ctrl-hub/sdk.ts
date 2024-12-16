import type { Model } from '../types/Model';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
export declare class Permission implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    _relationships?: any;
    included?: any;
    description: string;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): Permission;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}
