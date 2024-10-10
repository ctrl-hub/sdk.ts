import { ClientConfig } from "./ClientConfig";
import { ModelInterface } from "../interfaces/ModelInterface";
import { RequestOptions } from "../utils/RequestOptions";
import { FormCategoryService } from "./FormCategoryService";
import type { InternalResponse } from "../interfaces/ResponseInterface"
import {ServicesInterface} from "../interfaces/Services";
import {FormCategory} from "../models/FormCategory";

export class Client {
    readonly config: ClientConfig;
    public organisation: string;
    public formCategories: FormCategoryService;
    private models: Map<string, ModelInterface> = new Map();
    public resources;

    constructor(config: ClientConfig) {
        this.config = config;
        this.organisation = '';
        this.resources = {};

        this.formCategories = new FormCategoryService(this);

        this.registerModel(new FormCategory());

        return this.setupProxy({
            formCategories: FormCategoryService
        });
    }

    public registerModel(model: ModelInterface) {
        this.models.set(model.type, model);
    }

    public getModel(type: string): ModelInterface | undefined {
        return this.models.get(type);
    }

    public hydrateModel(type: string, data: Partial<Record<string, any>>): ModelInterface | undefined {
        const model = this.getModel(type);

        if (model) {
            model.hydrate(data); // Assuming all models implement a hydrate method
        }

        return model;
    }

    private setupProxy(services: Record<keyof ServicesInterface, new (client: Client) => any>) {
        // Initialize and assign services to both `resources` and `this`
        Object.keys(services).forEach((key) => {
            const ServiceClass = services[key as keyof ServicesInterface];
            const instance = new ServiceClass(this);
            this.resources[key as keyof ServicesInterface] = instance;
            (this as any)[key] = instance; // Assign to class property for direct access
        });

        // Create a proxy that only targets services
        return new Proxy(this, {
            get: (target, prop) => {
                if (prop in services) {
                    return (target as any)[prop];
                }
                return Reflect.get(target, prop);
            },
        });
    }

    setOrganisationSlug(organisation: string) {
        this.config.organisationId = organisation;
    }

    finalEndpoint(model: ModelInterface): string {
        return `${this.config.baseDomain}${model.endpoint.replace(':orgId', this.config.organisationId.toString())}`;
    }

    buildRequestURL(baseEndpoint: string, param?: string | RequestOptions | null): string {
        let endpoint = baseEndpoint;
        if (param instanceof RequestOptions) {
            endpoint += `?${param.toURLSearchParams().toString()}`;
        } else if (typeof param === 'string') {
            endpoint += `/${param}`;
        }
        return endpoint;
    }

    error(error)
    {
        return {
            ok: false,
            statusCode: error, // If there's no response, status code is 0
            error,
            data: null,
            errors: {
                client: [], // Empty client-side errors for now
                network: [], // Capture the error if it's a network issue
                api: [error], // Empty API errors for now
            },
            meta: null,
            links: {},
            included: []
        };
    }

    async makeGetRequest(baseEndpoint: string, param?: string | RequestOptions | null): Promise<any> {
        let url = this.buildRequestURL(baseEndpoint, param);

        try {
            const fetchResponse = await fetch(url);
            let json = await fetchResponse.json();

            let response = {
                ok: fetchResponse.ok, // own version
                statusCode: fetchResponse.status,
                headers: fetchResponse.headers,
                meta: null,
                links: null,
                data: null,
                included: null,
                errors: {
                    client: [],
                    network: [],
                    api: [],
                }
            }

            if (json) {

                if (json.meta) {
                    response.meta = json.meta;
                }

                if (json.included) {
                    response.included = json.included
                }

                if (json.links) {
                    response.links = json.links
                }

                if (json.data) {
                    response.data = json.data
                }

                if (json.errors) {
                    response.errors.api = json.errors;
                }

            }

            return response;

            // check if the body is json
            // see if data exists, set it
            // see if errors exists

            // If the response status is not 2xx, throw an error with the response
            // if (!response.ok) {
            //     const headers: Record<string, string> = {};
            //     response.headers.forEach((value, key) => {
            //         headers[key] = value;
            //     });
            //
            //     return this.error({
            //         statusCode: response.status,
            //         title: response.statusText, // Provide the raw data from the failed response
            //     });
            // }

            // console.log('here1');
            // const data = await response.json().catch(() => null);
            // console.log('here2');
            // const headers: Record<string, string> = {};
            // response.headers.forEach((value, key) => {
            //     headers[key] = value;
            // });
            //
            // console.log('here3');



            // Return the successful response
            return {
                ok: response.ok,
                statusCode: response.status,
                headers,
                data: null, // The response's main data
                errors: {
                    client: [],
                    network: [],
                    api: [],
                },
                meta: null,
                links: {},
                included: []
            };

        } catch (error) {

            console.log(error)

            // Initialize headers object
            // let headers: Record<string, string> = {};
            //
            // // If error is a Response object, extract its headers
            // if (error.headers) {
            //     headers = error.headers;
            // }

            return {
                ok: false,
                statusCode: error.statusCode || 0, // If there's no response, status code is 0
                headers: error.headers,
                data: null,
                errors: {
                    client: [], // Empty client-side errors for now
                    network: [error.code], // Capture the error if it's a network issue
                    api: [], // Empty API errors for now
                },
                meta: null,
                links: {},
                included: []
            };
        }
    }

    create(model: ModelInterface) {
        console.log(JSON.stringify({
            action: 'create',
            type: model.type,
            organisation: this.organisation,
            endpoint: this.finalEndpoint(model),
            entity: model
        }, null, 2));
    }

    update(model: ModelInterface) {
        console.log(JSON.stringify({
            action: 'update',
            type: model.type,
            organisation: this.organisation,
            endpoint: this.finalEndpoint(model),
            entity: model
        }, null, 2));
    }
}