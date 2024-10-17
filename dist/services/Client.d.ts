import { ClientConfig } from "./ClientConfig";
import { RequestOptions } from "../utils/RequestOptions";
import { Hydrator } from "../utils/Hydrator";
import type { Service } from "../types/Service";
import type { ServiceMethods } from "../types/ServiceMethods";
import type { InternalResponse } from "../types/Response";
import { Model } from "@src/types/Model";
export declare class Client {
    readonly config: ClientConfig;
    organisation: string;
    services: Record<string, Service>;
    hydrator: Hydrator;
    submissions: ServiceMethods;
    forms: ServiceMethods;
    formCategories: ServiceMethods;
    roles: ServiceMethods;
    permissions: ServiceMethods;
    serviceAccounts: ServiceMethods;
    constructor(config: ClientConfig);
    setOrganisationSlug(organisation: string): void;
    finalEndpoint(service: Service): string;
    create(model: Model): Promise<any>;
    private setupProxies;
    makePostRequest(baseEndpoint: string, body?: any, // Request body (e.g., JSON object)
    param?: string | RequestOptions | null, headers?: Record<string, string>): Promise<any>;
    makeGetRequest(baseEndpoint: string, param?: string | RequestOptions | null): Promise<any>;
    getResource(service: Service, param: string | RequestOptions | null): Promise<InternalResponse>;
}
