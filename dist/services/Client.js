"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const RequestOptions_1 = require("../utils/RequestOptions");
const FormCategory_1 = require("../models/FormCategory");
const Requests_1 = require("../utils/Requests");
const ServiceAccount_1 = require("../models/ServiceAccount");
const ServiceAccountKey_1 = require("../models/ServiceAccountKey");
const Hydrator_1 = require("../utils/Hydrator");
class Client {
    config;
    organisation;
    services = {};
    hydrator;
    // @ts-ignore
    formCategories;
    // @ts-ignore
    serviceAccounts;
    constructor(config) {
        this.config = config;
        this.organisation = '';
        this.services['formCategories'] = {
            endpoint: '/v3/orgs/:orgId/data-capture/form-categories',
            model: FormCategory_1.FormCategory,
            type: 'form-categories',
        };
        this.services['serviceAccounts'] = {
            endpoint: '/v3/orgs/:orgId/admin/iam/service-accounts',
            model: ServiceAccount_1.ServiceAccount,
            type: 'service-accounts'
        };
        this.services['serviceAccountKeys'] = {
            endpoint: '/v3/orgs/:orgId/admin/iam/service-accounts',
            model: ServiceAccountKey_1.ServiceAccountKey,
            type: 'service-account-keys'
        };
        this.hydrator = new Hydrator_1.Hydrator(this.services);
        // ensure we can do (as example):
        // client.formCategories.get() and return hydrated models based on this.services['formCategories']
        return this.setupProxies();
    }
    setOrganisationSlug(organisation) {
        this.config.organisationId = organisation;
    }
    finalEndpoint(service) {
        return `${this.config.baseDomain}${service.endpoint.replace(':orgId', this.config.organisationId.toString())}`;
    }
    setupProxies() {
        return new Proxy(this, {
            get: (client, service) => {
                if (service in client.services) {
                    const serviceInfo = client.services[service];
                    return new Proxy({}, {
                        get: (_, method) => {
                            if (method === 'get') {
                                return (param) => {
                                    // cleanup
                                    if (typeof param === "string") {
                                        // @ts-ignore
                                        return client.getResource(serviceInfo, param);
                                    }
                                    const requestOptions = param ? new RequestOptions_1.RequestOptions(param) : null;
                                    // @ts-ignore
                                    return client.getResource(serviceInfo, requestOptions);
                                };
                            }
                            return () => `Method ${method.toString()} called on service ${service}`;
                        }
                    });
                }
                return Reflect.get(client, service);
            }
        });
    }
    async makeGetRequest(baseEndpoint, param) {
        let url = Requests_1.Requests.buildRequestURL(baseEndpoint, param);
        try {
            const fetchResponse = await fetch(url);
            let json = await fetchResponse.json();
            return Requests_1.Requests.buildInternalResponse(fetchResponse, json);
        }
        catch (error) {
            return Requests_1.Requests.buildInternalErrorResponse(error);
        }
    }
    async getResource(service, param) {
        const response = await this.makeGetRequest(this.finalEndpoint(service), param);
        return this.hydrator.hydrateResponse(service, response);
    }
}
exports.Client = Client;
