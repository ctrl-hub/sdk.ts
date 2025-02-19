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
import { EquipmentExposureService } from './services/EquipmentExposureService';
import { VehicleManufacturersService } from '@services/VehicleManufacturersService';
import { VehicleModelsService } from '@services/VehicleModelsService';
import { VehicleCategoriesService } from '@services/VehicleCategoriesService';
import { EquipmentManufacturersService } from '@services/EquipmentManufacturersService';
import { EquipmentCategoriesService } from '@services/EquipmentCategoriesService';
import { EquipmentModelsService } from '@services/EquipmentModelsService';
import { PropertiesService } from '@services/PropertiesService';
import { VehicleModelSpecificationService } from '@services/VehicleModelSpecificationService';
import { ContactsService } from '@services/ContactsService';
import { CustomerAccountsService } from '@services/CustomerAccountsService';
import { CustomerInteractionsService } from '@services/CustomerInteractionsService';
import { TeamsService } from '@services/TeamsService';
import { SchemesService } from '@services/SchemesService';
import { WorkOrdersService } from '@services/WorkOrdersService';
import { OperationsService } from '@services/OperationsService';
import { OperationTemplatesService } from '@services/OperationTemplatesService';
import { VehicleInspectionService } from '@services/VehicleInspectionService';
import { VehicleInventoryCheckService } from '@services/VehicleInventoryCheckService';
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
    schemes(): SchemesService;
    workOrders(schemeId: string): WorkOrdersService;
    operations(schemeId: string, workOrderId: string): OperationsService;
    operationTemplates(): OperationTemplatesService;
    serviceAccountKeys(): ServiceAccountKeysService;
    customerAccounts(customerAccountId?: string): CustomerAccountsService;
    contacts(): ContactsService;
    customerInteractions(): CustomerInteractionsService;
    serviceAccounts(): ServiceAccountsService;
    formCategories(): FormCategoriesService;
    forms(): FormsService;
    teams(): TeamsService;
    submissions(): SubmissionsService;
    permissions(): PermissionsService;
    groups(): GroupsService;
    vehicles(): VehiclesService;
    vehicleManufacturers(): VehicleManufacturersService;
    vehicleCategories(): VehicleCategoriesService;
    vehicleModels(): VehicleModelsService;
    equipment(): EquipmentService;
    equipmentExposures(): EquipmentExposureService;
    equipmentManufacturers(): EquipmentManufacturersService;
    equipmentModels(): EquipmentModelsService;
    equipmentCategories(): EquipmentCategoriesService;
    properties(): PropertiesService;
    vehicleModelSpecifications(): VehicleModelSpecificationService;
    vehicleInspections(): VehicleInspectionService;
    vehicleInventoryChecks(): VehicleInventoryCheckService;
    setOrganisationSlug(organisation: string): void;
    substituteOrganisation(url: string): string;
    makeDeleteRequest(endpoint: string): Promise<any>;
    makePostRequest(baseEndpoint: string, body?: any, param?: string | RequestOptions | null): Promise<any>;
    makeGetRequest(baseEndpoint: string, param?: string | RequestOptions): Promise<InternalResponse>;
    makePatchRequest(baseEndpoint: string, body?: any, param?: string | RequestOptions | null): Promise<any>;
}
