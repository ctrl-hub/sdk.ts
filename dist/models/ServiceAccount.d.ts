import type { Model } from '../types/Model';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
export declare class ServiceAccount implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    _relationships?: any;
    included?: any;
    name: string;
    description: string;
    email: string;
    enabled: boolean;
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): ServiceAccount;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}
