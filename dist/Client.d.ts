import type { ClientConfigInterface } from './ClientConfig';
import { RequestOptions } from './utils/RequestOptions';
import { FormCategoriesService } from './services/FormCategoriesService';
import { RolesService } from './services/RolesService';
import { PermissionsService } from './services/PermissionsService';
import { SubmissionsService } from './services/SubmissionsService';
import { FormsService } from './services/FormsService';
import { ServiceAccountsService } from './services/ServiceAccountService';
import { ServiceAccountKeysService } from './services/ServiceAccountKeysService';
import type { InternalResponse } from './types/Response';
import { GroupsService } from './services/GroupService';
import { VehiclesService } from './services/VehiclesService';
import { EquipmentService } from './services/EquipmentService';
import { VehicleManufacturersService } from '@services/VehicleManufacturersService';
import { VehicleModelsService } from '@services/VehicleModelsService';
import { EquipmentManufacturersService } from '@services/EquipmentManufacturersService';
import { EquipmentModelsService } from '@services/EquipmentModelsService';
import { PropertiesService } from '@services/PropertiesService';
export declare class Client {
    readonly config: ClientConfigInterface;
    organisation: string;
    services: Record<string, any>;
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
    groups(): GroupsService;
    vehicles(): VehiclesService;
    vehicleManufacturers(): VehicleManufacturersService;
    vehicleModels(): VehicleModelsService;
    equipment(): EquipmentService;
    equipmentManufacturers(): EquipmentManufacturersService;
    equipmentModels(): EquipmentModelsService;
    properties(): PropertiesService;
    setOrganisationSlug(organisation: string): void;
    substituteOrganisation(url: string): string;
    makeDeleteRequest(endpoint: string): Promise<any>;
    makePostRequest(baseEndpoint: string, body?: any, param?: string | RequestOptions | null): Promise<any>;
    makeGetRequest(baseEndpoint: string, param?: string | RequestOptions): Promise<InternalResponse>;
    makePatchRequest(baseEndpoint: string, body?: any, param?: string | RequestOptions | null): Promise<any>;
}
