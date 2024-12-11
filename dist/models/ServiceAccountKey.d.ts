import type { Model } from '../types/Model';
type Attributes = {
    client_id: string;
    enabled: boolean;
};
export declare class ServiceAccountKey implements Model {
    id: string;
    type: string;
    attributes: Attributes;
    meta: any;
    links: any;
    relationships?: any;
    included?: any;
    constructor(data?: ServiceAccountKey);
    static hydrate(data: any): ServiceAccountKey;
}
export {};
