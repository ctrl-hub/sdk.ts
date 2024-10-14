declare module "services/ClientConfig" {
    export type ClientConfigInterface = {
        organisationId: string;
        baseDomain?: string;
    };
    export class ClientConfig {
        organisationId: string;
        baseDomain: string;
        constructor(config: ClientConfigInterface);
    }
}
declare module "utils/RequestOptions" {
    type Sort = {
        key: string;
        direction?: 'asc' | 'desc';
    };
    export type RequestOptionsType = {
        sort?: Sort[];
        limit?: number;
        offset?: number;
    };
    export class RequestOptions {
        sort?: Sort[];
        limit?: number;
        offset?: number;
        constructor(options: RequestOptionsType);
        toURLSearchParams(): URLSearchParams;
    }
}
declare module "models/FormCategory" {
    import type { Model } from "../types/Model";
    type FormCategoryAttributes = {
        name: string;
    };
    export class FormCategory implements Model {
        id: string;
        type: string;
        attributes: FormCategoryAttributes;
        meta: any;
        links: any;
        constructor();
        static hydrate(data: any): FormCategory;
    }
}
declare module "utils/Requests" {
    import { RequestOptions } from "utils/RequestOptions";
    export class Requests {
        static buildRequestURL(baseEndpoint: string, param?: string | RequestOptions | null): string;
        static buildInternalResponse(fetchResponse: any, json: any): {
            ok: any;
            statusCode: any;
            headers: any;
            meta: any;
            links: any;
            data: any;
            included: any;
            errors: {
                client: never[];
                network: never[];
                api: any;
            };
        };
        static buildInternalErrorResponse(error: any): {
            ok: boolean;
            statusCode: any;
            headers: any;
            data: null;
            errors: {
                client: never[];
                network: any[];
                api: never[];
            };
            meta: null;
            links: {};
            included: never[];
        };
    }
}
declare module "models/ServiceAccount" {
    import type { Model } from "../types/Model";
    type ServiceAccountAttributes = {
        name: string;
        description: string;
        email: string;
        enabled: boolean;
    };
    export class ServiceAccount implements Model {
        id: string;
        type: string;
        attributes: ServiceAccountAttributes;
        meta: any;
        relationships?: any;
        links: any;
        constructor();
        static hydrate(data: any, fullResponseData: any): ServiceAccount;
    }
}
declare module "models/ServiceAccountKey" {
    import type { Model } from "../types/Model";
    type Attributes = {
        client_id: string;
    };
    export class ServiceAccountKey implements Model {
        id: string;
        type: string;
        attributes: Attributes;
        meta: any;
        relationships: any[];
        links: any;
        constructor();
        static hydrate(data: any, fullResponseData: any): ServiceAccountKey;
    }
}
declare module "utils/Hydrator" {
    import type { Model } from "../types/Model";
    import type { Service } from "../types/Service";
    interface JsonData {
        id: string;
        type: string;
        attributes?: Record<string, any>;
        relationships?: Record<string, {
            data: any[];
        }>;
        meta?: Record<string, any>;
        links?: string[];
    }
    export class Hydrator {
        private services;
        constructor(services: Record<string, any>);
        hydrateResponse(service: Service, response: any): any;
        hydrateJson(json: JsonData): Model | null;
        hydrateRelationships(single: JsonData, included: JsonData[]): JsonData;
        populateModelAttributes(model: any, json: any): void;
        findServiceModel(type: string): any;
        findMatchingIncluded(relation: any, included: any[]): any;
    }
}
declare module "services/Client" {
    import { ClientConfig } from "services/ClientConfig";
    import { RequestOptions } from "utils/RequestOptions";
    import { Hydrator } from "utils/Hydrator";
    import type { Service } from "../types/Service";
    import type { ServiceMethods } from "../types/ServiceMethods";
    import type { InternalResponse } from "../types/Response";
    export class Client {
        readonly config: ClientConfig;
        organisation: string;
        services: Record<string, Service>;
        hydrator: Hydrator;
        formCategories: ServiceMethods;
        serviceAccounts: ServiceMethods;
        constructor(config: ClientConfig);
        setOrganisationSlug(organisation: string): void;
        finalEndpoint(service: Service): string;
        private setupProxies;
        makeGetRequest(baseEndpoint: string, param?: string | RequestOptions | null): Promise<any>;
        getResource(service: Service, param: string | RequestOptions | null): Promise<InternalResponse>;
    }
}
declare module "index" {
    export { Client } from "services/Client";
    export { ClientConfig } from "services/ClientConfig";
}
