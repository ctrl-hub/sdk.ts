import type { Model } from "../types/Model";
type Attributes = {
    client_id: string;
    enabled: boolean;
};
export declare class ServiceAccountKey implements Model {
    id: string;
    type: string;
    attributes: Attributes;
    meta: any;
    relationships: any[];
    links: any;
    constructor();
    static hydrate(data: any, fullResponseData: any): ServiceAccountKey;
}
export {};
