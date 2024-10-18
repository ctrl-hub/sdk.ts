import { ClientConfigInterface } from "./ClientConfig";
import { RequestOptions } from "./utils/RequestOptions";
import { Hydrator } from "./utils/Hydrator";
import { FormCategoriesService } from "./services/FormCategoriesService";
import { RolesService } from "./services/RolesService";
import { PermissionsService } from "./services/PermissionsService";
import { SubmissionsService } from "./services/SubmissionsService";
import { FormsService } from "./services/FormsService";
import { ServiceAccountsService } from "./services/ServiceAccountService";
import { ServiceAccountKeysService } from "./services/ServiceAccountKeysService";
import { InternalResponse } from "./types/Response";
export declare class Client {
    readonly config: ClientConfigInterface;
    organisation: string;
    services: Record<string, any>;
    hydrator: Hydrator;
    constructor(config: ClientConfigInterface);
    roles(): RolesService;
    serviceAccountKeys(): ServiceAccountKeysService;
    serviceAccounts(): ServiceAccountsService;
    formCategories(): FormCategoriesService;
    forms(): FormsService;
    submissions(): SubmissionsService;
    permissions(): PermissionsService;
    getServiceEndpoint(serviceName: string): String;
    setOrganisationSlug(organisation: string): void;
    finalEndpoint(url: string): string;
    makePostRequest(baseEndpoint: string, body?: any, // Request body (e.g., JSON object)
    param?: string | RequestOptions | null, headers?: Record<string, string>): Promise<any>;
    makeGetRequest(baseEndpoint: string, param?: string | RequestOptions): Promise<InternalResponse>;
}
