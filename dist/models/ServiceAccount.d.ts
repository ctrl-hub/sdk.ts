import type { Model } from '../types/Model';
type ServiceAccountAttributes = {
    name: string;
    description: string;
    email: string;
    enabled: boolean;
};
export declare class ServiceAccount implements Model {
    id: string;
    type: string;
    attributes: ServiceAccountAttributes;
    meta: any;
    links: any;
    relationships?: any;
    included?: any;
    constructor(data?: ServiceAccount);
    static hydrate(data: any): ServiceAccount;
}
export {};
