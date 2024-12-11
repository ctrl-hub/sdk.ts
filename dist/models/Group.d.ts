import type { Model } from '../types/Model';
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
type GroupAttributes = {
    name: string;
    description: string;
    bindings: Binding[];
};
export declare class Group implements Model {
    id: string;
    type: string;
    attributes: GroupAttributes;
    meta: any;
    links: any;
    relationships?: any;
    included?: any;
    constructor(data?: Group);
    static hydrate(data: any): Group;
}
export {};
