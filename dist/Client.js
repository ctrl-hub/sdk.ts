import { RequestOptions } from './utils/RequestOptions';
import { Requests } from './utils/Requests';
import { FormCategoriesService } from './services/FormCategoriesService';
import { RolesService } from './services/RolesService';
import { PermissionsService } from './services/PermissionsService';
import { SubmissionsService } from './services/SubmissionsService';
import { FormsService } from './services/FormsService';
import { ServiceAccountsService } from './services/ServiceAccountService';
import { ServiceAccountKeysService } from './services/ServiceAccountKeysService';
import { GroupsService } from './services/GroupService';
import { VehiclesService } from './services/VehiclesService';
import { EquipmentService } from './services/EquipmentService';
import { EquipmentExposureService } from './services/EquipmentExposureService';
import { VehicleManufacturersService } from './services/VehicleManufacturersService';
import { VehicleModelsService } from './services/VehicleModelsService';
import { VehicleCategoriesService } from './services/VehicleCategoriesService';
import { EquipmentManufacturersService } from './services/EquipmentManufacturersService';
import { EquipmentCategoriesService } from './services/EquipmentCategoriesService';
import { EquipmentModelsService } from './services/EquipmentModelsService';
import { PropertiesService } from './services/PropertiesService';
import { VehicleModelSpecificationService } from './services/VehicleModelSpecificationService';
import { ContactsService } from './services/ContactsService';
import { CustomerAccountsService } from './services/CustomerAccountsService';
import { CustomerInteractionsService } from './services/CustomerInteractionsService';
import { TeamsService } from './services/TeamsService';
import { SchemesService } from './services/SchemesService';
import { WorkOrdersService } from './services/WorkOrdersService';
import { OperationsService } from './services/OperationsService';
import { OperationTemplatesService } from './services/OperationTemplatesService';
import { VehicleInspectionService } from './services/VehicleInspectionService';
import { VehicleInventoryCheckService } from './services/VehicleInventoryCheckService';
import { AppointmentsService } from './services/AppointmentsService';
import { OrganisationsService } from './services/OrganisationsService';
import { OrganisationMembersService } from './services/OrganisationMembersService';
import { SchemeTemplatesService } from './services/SchemeTemplatesService';
import { WorkOrderTemplatesService } from './services/WorkOrderTemplatesService';
export class Client {
    config;
    organisation;
    services = {};
    bearerToken = '';
    tokenPromise = null;
    constructor(config) {
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
    roles() {
        return new RolesService(this);
    }
    schemes() {
        return new SchemesService(this);
    }
    schemeTemplates() {
        return new SchemeTemplatesService(this);
    }
    workOrders(schemeId) {
        return new WorkOrdersService(this, schemeId);
    }
    workOrderTemplates() {
        return new WorkOrderTemplatesService(this);
    }
    operations(schemeId, workOrderId, operationId) {
        return new OperationsService(this, schemeId, workOrderId, operationId);
    }
    operationTemplates() {
        return new OperationTemplatesService(this);
    }
    serviceAccountKeys() {
        return new ServiceAccountKeysService(this);
    }
    customerAccounts(customerAccountId) {
        return new CustomerAccountsService(this, customerAccountId);
    }
    contacts() {
        return new ContactsService(this);
    }
    customerInteractions() {
        return new CustomerInteractionsService(this);
    }
    serviceAccounts() {
        return new ServiceAccountsService(this);
    }
    formCategories() {
        return new FormCategoriesService(this);
    }
    forms() {
        return new FormsService(this);
    }
    appointments() {
        return new AppointmentsService(this);
    }
    teams(teamId) {
        return new TeamsService(this, teamId);
    }
    submissions() {
        return new SubmissionsService(this);
    }
    permissions() {
        return new PermissionsService(this);
    }
    groups(groupId) {
        return new GroupsService(this, groupId);
    }
    vehicles(vehicleId) {
        return new VehiclesService(this, vehicleId);
    }
    vehicleManufacturers() {
        return new VehicleManufacturersService(this);
    }
    vehicleCategories() {
        return new VehicleCategoriesService(this);
    }
    vehicleModels() {
        return new VehicleModelsService(this);
    }
    equipment() {
        return new EquipmentService(this);
    }
    equipmentExposures() {
        return new EquipmentExposureService(this);
    }
    equipmentManufacturers() {
        return new EquipmentManufacturersService(this);
    }
    equipmentModels() {
        return new EquipmentModelsService(this);
    }
    equipmentCategories() {
        return new EquipmentCategoriesService(this);
    }
    properties() {
        return new PropertiesService(this);
    }
    vehicleModelSpecifications() {
        return new VehicleModelSpecificationService(this);
    }
    vehicleInspections() {
        return new VehicleInspectionService(this);
    }
    vehicleInventoryChecks() {
        return new VehicleInventoryCheckService(this);
    }
    organisations() {
        return new OrganisationsService(this);
    }
    organisationMembers() {
        return new OrganisationMembersService(this);
    }
    setOrganisationSlug(organisation) {
        this.config.organisationId = organisation;
    }
    substituteOrganisation(url) {
        return `${this.config.baseDomain}${url.replace(':orgId', this.config.organisationId.toString())}`;
    }
    async makeDeleteRequest(endpoint) {
        await this.ensureAuthenticated();
        let url = Requests.buildRequestURL(endpoint);
        url = this.substituteOrganisation(url);
        let headers = {
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
        }
        catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }
    async makePostRequest(baseEndpoint, body, param) {
        await this.ensureAuthenticated();
        let url = Requests.buildRequestURL(baseEndpoint, param);
        url = this.substituteOrganisation(url);
        let headers = {
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
        }
        catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }
    async makeGetRequest(baseEndpoint, param) {
        await this.ensureAuthenticated();
        let url = Requests.buildRequestURL(baseEndpoint, param);
        url = this.substituteOrganisation(url);
        let headers = {
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
        }
        catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }
    async makePatchRequest(baseEndpoint, body, param) {
        await this.ensureAuthenticated();
        let url = Requests.buildRequestURL(baseEndpoint, param);
        url = this.substituteOrganisation(url);
        let headers = {
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
        }
        catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }
}
