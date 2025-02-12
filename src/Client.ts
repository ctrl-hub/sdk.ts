import type { ClientConfigInterface } from './ClientConfig';
import { RequestOptions } from './utils/RequestOptions';
import { Requests } from './utils/Requests';
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
import { VehicleCategoriesService } from '@services/VehicleCategoriesService';
import { EquipmentManufacturersService } from '@services/EquipmentManufacturersService';
import { EquipmentCategoriesService } from '@services/EquipmentCategoriesService';
import { EquipmentModelsService } from '@services/EquipmentModelsService';
import { PropertiesService } from '@services/PropertiesService';
import { VehicleModelSpecificationService } from '@services/VehicleModelSpecificationService';
import { CustomersService } from '@services/CustomersService';
import { CustomerInteractionsService } from '@services/CustomerInteractionsService';
import { TeamsService } from '@services/TeamsService';
import { SchemesService } from '@services/SchemesService';
import { WorkOrdersService } from '@services/WorkOrdersService';
import { OperationsService } from '@services/OperationsService';
import { OperationTemplatesService } from '@services/OperationTemplatesService';
import { VehicleInspectionService } from '@services/VehicleInspectionService';
import { VehicleInventoryCheckService } from '@services/VehicleInventoryCheckService';

export class Client {
    readonly config: ClientConfigInterface;
    public organisation: string;
    public services: Record<string, any> = {};
    public bearerToken: string = '';
    private tokenPromise: Promise<void> | null = null;

    constructor(config: ClientConfigInterface) {
        this.config = config;
        this.organisation = '';

        if (config.clientId && config.clientSecret && config.authDomain) {
            this.tokenPromise = this.getToken();
        }
    }

    async getToken() {
        const url = this.config.authDomain || '';

        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', this.config.clientId || '');
        params.append('client_secret', this.config.clientSecret || '');

        const response = await fetch(url + '/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            body: params.toString(),
        });

        let tokenJson = await response.json();

        if (tokenJson.access_token) {
            this.bearerToken = tokenJson.access_token;
        }
    }

    async ensureAuthenticated() {
        if (this.tokenPromise) {
            await this.tokenPromise;
            this.tokenPromise = null;
        }
    }

    public roles(): RolesService {
        return new RolesService(this);
    }

    public schemes(): SchemesService {
        return new SchemesService(this);
    }

    public workOrders(schemeId: string): WorkOrdersService {
        return new WorkOrdersService(this, schemeId);
    }

    public operations(schemeId: string, workOrderId: string): OperationsService {
        return new OperationsService(this, schemeId, workOrderId);
    }

    public operationTemplates(): OperationTemplatesService {
        return new OperationTemplatesService(this);
    }

    public serviceAccountKeys(): ServiceAccountKeysService {
        return new ServiceAccountKeysService(this);
    }

    public customers(): CustomersService {
        return new CustomersService(this);
    }

    public customerInteractions(customerId: string): CustomerInteractionsService {
        return new CustomerInteractionsService(this, customerId);
    }

    public serviceAccounts(): ServiceAccountsService {
        return new ServiceAccountsService(this);
    }

    public formCategories(): FormCategoriesService {
        return new FormCategoriesService(this);
    }

    public forms(): FormsService {
        return new FormsService(this);
    }

    public teams(): TeamsService {
        return new TeamsService(this);
    }

    public submissions(): SubmissionsService {
        return new SubmissionsService(this);
    }

    public permissions(): PermissionsService {
        return new PermissionsService(this);
    }

    public groups(): GroupsService {
        return new GroupsService(this);
    }

    public vehicles(): VehiclesService {
        return new VehiclesService(this);
    }

    public vehicleManufacturers(): VehicleManufacturersService {
        return new VehicleManufacturersService(this);
    }

    public vehicleCategories(): VehicleCategoriesService {
        return new VehicleCategoriesService(this);
    }

    public vehicleModels(): VehicleModelsService {
        return new VehicleModelsService(this);
    }

    public equipment(): EquipmentService {
        return new EquipmentService(this);
    }

    public equipmentManufacturers(): EquipmentManufacturersService {
        return new EquipmentManufacturersService(this);
    }

    public equipmentModels(): EquipmentModelsService {
        return new EquipmentModelsService(this);
    }

    public equipmentCategories(): EquipmentCategoriesService {
        return new EquipmentCategoriesService(this);
    }

    public properties(): PropertiesService {
        return new PropertiesService(this);
    }

    public vehicleModelSpecifications(): VehicleModelSpecificationService {
        return new VehicleModelSpecificationService(this);
    }

    public vehicleInspections(): VehicleInspectionService {
        return new VehicleInspectionService(this);
    }

    public vehicleInventoryChecks(): VehicleInventoryCheckService {
        return new VehicleInventoryCheckService(this);
    }

    setOrganisationSlug(organisation: string) {
        this.config.organisationId = organisation;
    }

    substituteOrganisation(url: string): string {
        return `${this.config.baseDomain}${url.replace(':orgId', this.config.organisationId.toString())}`;
    }

    async makeDeleteRequest(endpoint: string): Promise<any> {
        await this.ensureAuthenticated();

        let url = Requests.buildRequestURL(endpoint);
        url = this.substituteOrganisation(url);

        let headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.bearerToken) {
            headers['Authorization'] = `Bearer ${this.bearerToken}`;
        }

        try {
            const fetchResponse = await fetch(url, {
                method: 'DELETE',
                headers: headers,
                credentials: 'include',
            });

            let json = await fetchResponse.json();
            return Requests.buildInternalResponse(fetchResponse, json);
        } catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }

    async makePostRequest(baseEndpoint: string, body?: any, param?: string | RequestOptions | null): Promise<any> {
        await this.ensureAuthenticated();

        let url = Requests.buildRequestURL(baseEndpoint, param);
        url = this.substituteOrganisation(url);

        let headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.bearerToken) {
            headers['Authorization'] = `Bearer ${this.bearerToken}`;
        }

        try {
            const fetchResponse = await fetch(url, {
                method: 'POST',
                headers: headers,
                credentials: 'include',
                body: JSON.stringify(body),
            });

            let json = await fetchResponse.json();
            return Requests.buildInternalResponse(fetchResponse, json);
        } catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }

    async makeGetRequest(baseEndpoint: string, param?: string | RequestOptions): Promise<InternalResponse> {
        await this.ensureAuthenticated();

        let url = Requests.buildRequestURL(baseEndpoint, param);
        url = this.substituteOrganisation(url);

        let headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.bearerToken) {
            headers['Authorization'] = `Bearer ${this.bearerToken}`;
        }

        try {
            // @todo switch on cookie, "X-Session-Token" or client_credentials
            const fetchResponse = await fetch(url, {
                credentials: 'include', // @todo only required for cookie based auth,
                headers: headers,
            });
            let json = await fetchResponse.json();
            return Requests.buildInternalResponse(fetchResponse, json);
        } catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }

    async makePatchRequest(baseEndpoint: string, body?: any, param?: string | RequestOptions | null): Promise<any> {
        await this.ensureAuthenticated();

        let url = Requests.buildRequestURL(baseEndpoint, param);
        url = this.substituteOrganisation(url);

        let headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.bearerToken) {
            headers['Authorization'] = `Bearer ${this.bearerToken}`;
        }

        try {
            const fetchResponse = await fetch(url, {
                method: 'PATCH',
                headers: headers,
                credentials: 'include',
                body: JSON.stringify(body),
            });

            let json = await fetchResponse.json();
            return Requests.buildInternalResponse(fetchResponse, json);
        } catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }
}
