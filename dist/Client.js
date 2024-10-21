import { Requests } from "./utils/Requests";
import { Hydrator } from "./utils/Hydrator";
import { FormCategoriesService } from "./services/FormCategoriesService";
import { RolesService } from "./services/RolesService";
import { PermissionsService } from "./services/PermissionsService";
import { SubmissionsService } from "./services/SubmissionsService";
import { FormsService } from "./services/FormsService";
import { ServiceAccountsService } from "./services/ServiceAccountService";
import { ServiceAccountKeysService } from "./services/ServiceAccountKeysService";
export class Client {
    config;
    organisation;
    services = {};
    hydrator;
    bearerToken = '';
    tokenPromise = null;
    constructor(config) {
        this.config = config;
        this.organisation = "";
        this.hydrator = new Hydrator(this.services);
        if (config.clientId && config.clientSecret && config.authDomain) {
            this.tokenPromise = this.getToken();
        }
    }
    async getToken() {
        const url = this.config.authDomain || '';
        const params = new URLSearchParams();
        params.append("grant_type", "client_credentials");
        params.append("client_id", this.config.clientId || '');
        params.append("client_secret", this.config.clientSecret || '');
        const response = await fetch(url + '/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            body: params.toString()
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
    setOrganisationSlug(organisation) {
        this.config.organisationId = organisation;
    }
    finalEndpoint(url) {
        return `${this.config.baseDomain}${url.replace(":orgId", this.config.organisationId.toString())}`;
    }
    async makePostRequest(baseEndpoint, body, param) {
        await this.ensureAuthenticated();
        let url = Requests.buildRequestURL(baseEndpoint, param);
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
        let headers = {
            'Content-Type': 'application/json',
        };
        if (this.bearerToken) {
            headers['Authorization'] = `Bearer ${this.bearerToken}`;
        }
        try {
            // @todo switch on cookie, "X-Session-Token" or client_credentials
            const fetchResponse = await fetch(url, {
                credentials: "include", // @todo only required for cookie based auth,
                headers: headers
            });
            let json = await fetchResponse.json();
            return Requests.buildInternalResponse(fetchResponse, json);
        }
        catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }
}
