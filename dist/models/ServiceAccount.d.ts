import type { Model } from "../types/Model";
import { ClientConfig } from "@services/ClientConfig";
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
    relationships?: any;
    links: any;
    constructor();
    addKey(config: ClientConfig): Promise<any>;
    static hydrate(data: any, fullResponseData: any): ServiceAccount;
}
export {};
