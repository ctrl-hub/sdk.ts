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
    bearerToken: string;
    private tokenPromise;
    constructor(config: ClientConfigInterface);
    getToken(): Promise<void>;
    ensureAuthenticated(): Promise<void>;
    roles(): RolesService;
    serviceAccountKeys(): ServiceAccountKeysService;
    serviceAccounts(): ServiceAccountsService;
    formCategories(): FormCategoriesService;
    forms(): FormsService;
    submissions(): SubmissionsService;
    permissions(): PermissionsService;
    setOrganisationSlug(organisation: string): void;
    finalEndpoint(url: string): string;
    makePostRequest(baseEndpoint: string, body?: any, param?: string | RequestOptions | null): Promise<any>;
    makeGetRequest(baseEndpoint: string, param?: string | RequestOptions): Promise<InternalResponse>;
}
