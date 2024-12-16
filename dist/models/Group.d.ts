import type { Model } from '../types/Model';
import type { RelationshipDefinition } from '../types/RelationshipDefinition';
type Binding = {
    id: string;
    role: string;
    condition: {
        gate: 'AND' | 'OR';
        rules: {
            type: string;
            operator: string;
            value: string;
        }[];
    };
};
export declare class Group implements Model {
    id: string;
    type: string;
    meta: any;
    links: any;
    _relationships?: any;
    included?: any;
    name: string;
    description: string;
    bindings: Binding[];
    static relationships: RelationshipDefinition[];
    constructor(data?: any);
    static hydrate(data: any): Group;
    toJSON(): Omit<this, "_relationships" | "toJSON">;
}
export {};
