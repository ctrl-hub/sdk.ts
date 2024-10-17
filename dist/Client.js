import { Requests } from "./utils/Requests";
import { Hydrator } from "./utils/Hydrator";
import { FormCategoriesService, RolesService, PermissionsService, SubmissionsService, FormsService, ServiceAccountsService, ServiceAccountKeysService } from '@services/index';
export class Client {
    config;
    organisation;
    services = {};
    hydrator;
    constructor(config) {
        this.config = config;
        this.organisation = "";
        this.hydrator = new Hydrator(this.services);
    }
    roles() {
        return new RolesService(this);
    }
    serviceAccountKeys() {
        return new ServiceAccountKeysService(this);
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
    submissions() {
        return new SubmissionsService(this);
    }
    permissions() {
        return new PermissionsService(this);
    }
    getServiceEndpoint(serviceName) {
        return this.services[serviceName] ? this.services[serviceName].endpoint : '';
    }
    setOrganisationSlug(organisation) {
        this.config.organisationId = organisation;
    }
    finalEndpoint(url) {
        return `${this.config.baseDomain}${url.replace(":orgId", this.config.organisationId.toString())}`;
    }
    async makePostRequest(baseEndpoint, body, // Request body (e.g., JSON object)
    param, headers) {
        let url = Requests.buildRequestURL(baseEndpoint, param);
        try {
            const fetchResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body), // Stringify the body if it's a JSON object
            });
            let json = await fetchResponse.json();
            return Requests.buildInternalResponse(fetchResponse, json);
        }
        catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }
    async makeGetRequest(baseEndpoint, param) {
        let url = Requests.buildRequestURL(baseEndpoint, param);
        try {
            // @todo switch on cookie, "X-Session-Token" or client_credentials
            const fetchResponse = await fetch(url, {
                credentials: "include", // @todo only required for cookie based auth,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            let json = await fetchResponse.json();
            return Requests.buildInternalResponse(fetchResponse, json);
        }
        catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }
}
