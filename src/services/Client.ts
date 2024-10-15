import {ClientConfig} from "./ClientConfig";
import type { ClientConfigInterface} from "./ClientConfig";
import {RequestOptions, RequestOptionsType} from "../utils/RequestOptions";
import {FormCategory} from "../models/FormCategory";
import {Requests} from "../utils/Requests";
import {ServiceAccount} from "../models/ServiceAccount";
import {ServiceAccountKey} from "../models/ServiceAccountKey";
import {Hydrator} from "../utils/Hydrator";
import type {Service} from "../types/Service";
import type {ServiceMethods} from "../types/ServiceMethods";
import type {ModelConstructor} from "../types/ModelConstructor";
import type {InternalResponse} from "../types/Response";

type Token = {
    access_token: string;
    token_type: string;
    expires_in?: number;
    scope?: string;
};

export class Client {
    readonly config: ClientConfig;
    public services: Record<string, Service> = {};
    public hydrator: Hydrator;
    public token: Token;

    // @ts-ignore
    public formCategories: ServiceMethods;
    // @ts-ignore
    public serviceAccounts: ServiceMethods;

    public static async create(config: ClientConfig) {
        let clientId = config.credentials.client_id || '';
        let clientSecret = config.credentials.client_secret || '';
        let sessionToken = config.credentials.session_token || '';

        if (sessionToken) {
            return new Client(config, {
                access_token: sessionToken,
                token_type: 'bearer',
            });
        }

        if(clientId === '' || clientSecret === '') {
            console.error('Client ID and Client Secret are required');
            return null;
            let token = await Client.getToken(clientId, clientSecret);
            return new Client(config, token);
        }

        let token = await Client.getToken(clientId, clientSecret);
        return new Client(config, token);
    }

    constructor(config: ClientConfig, token: Token) {
        this.config = config;
        this.token = token;

        this.services['formCategories'] = {
            endpoint: '/v3/orgs/:orgId/data-capture/form-categories',
            model: FormCategory as ModelConstructor<FormCategory>,
            type: 'form-categories',
        };

        this.services['serviceAccounts'] = {
            endpoint: '/v3/orgs/:orgId/admin/iam/service-accounts',
            model: ServiceAccount as ModelConstructor<ServiceAccount>,
            type: 'service-accounts'
        };

        this.services['serviceAccountKeys'] = {
            endpoint: '/v3/orgs/:orgId/admin/iam/service-accounts',
            model: ServiceAccountKey as ModelConstructor<ServiceAccountKey>,
            type: 'service-account-keys'
        };

        this.hydrator = new Hydrator(this.services);

        // ensure we can do (as example):
        // client.formCategories.get() and return hydrated models based on this.services['formCategories']
        return this.setupProxies();
    }

    public static async getToken(clientId: string, clientSecret: string) {
        const urlEncodedData = new URLSearchParams();
        urlEncodedData.append("grant_type", "client_credentials");
        urlEncodedData.append("client_id", clientId);
        urlEncodedData.append("client_secret", clientSecret);

        try {
            const response = await fetch('https://auth.ctrl-hub.dev/oauth2/token', {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
                },
                body: urlEncodedData.toString()
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching token:', error);
            throw new Error('Authentication failed');
        }
    }

    setOrganisationSlug(organisation: string) {
        this.config.organisationId = organisation;
    }

    finalEndpoint(service: Service): string {
        return `${this.config.baseDomain}${service.endpoint.replace(':orgId', this.config.organisationId.toString())}`;
    }

    private setupProxies() {
        return new Proxy(this, {
            get: <T>(client: Client, service: string) => {
                if (service in client.services) {
                    const serviceInfo = client.services[service];

                    return new Proxy({}, {
                        get: (_, method) => {
                            if (method === 'get') {
                                return (param: string | RequestOptionsType | null): Promise<InternalResponse> => {

                                    // cleanup
                                    if (typeof param === "string") {
                                        // @ts-ignore
                                        return client.getResource<T>(serviceInfo, param);
                                    }
                                    const requestOptions = param ? new RequestOptions(param) : null;
                                    // @ts-ignore
                                    return client.getResource<T>(serviceInfo, requestOptions);
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

    async makeGetRequest(baseEndpoint: string, param?: string | RequestOptions | null): Promise<any> {
        let url = Requests.buildRequestURL(baseEndpoint, param);

        try {
            const fetchResponse = await fetch(url);
            let json = await fetchResponse.json();
            return Requests.buildInternalResponse(fetchResponse, json);
        } catch (error) {
            return Requests.buildInternalErrorResponse(error);
        }
    }

    async getResource(service: Service, param: string | RequestOptions | null): Promise<InternalResponse> {
        const response = await this.makeGetRequest(this.finalEndpoint(service), param);
        return this.hydrator.hydrateResponse(service, response);
    }
}