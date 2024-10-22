import type { Model } from "../types/Model";
type Binding = {
    role: string;
    condition: {
        gate: string;
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
    constructor();
    static hydrate(data: any): Group;
}
export {};
