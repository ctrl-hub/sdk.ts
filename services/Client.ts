import { ClientConfig } from "./ClientConfig";
import { ModelInterface } from "../interfaces/ModelInterface";
import { RequestOptions } from "../utils/RequestOptions";
import { FormCategoryService } from "./FormCategoryService";
import type { InternalResponse } from "../interfaces/ResponseInterface"
import {ServicesInterface} from "../interfaces/Services";
import {FormCategory} from "../models/FormCategory";
import {ModelServiceInterface} from "../interfaces/ModelServiceInterface";
import {Requests} from "../utils/Requests";

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

    finalEndpoint(service: ModelServiceInterface): string {
        return `${this.config.baseDomain}${service.endpoint.replace(':orgId', this.config.organisationId.toString())}`;
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

    // create(model: ModelInterface) {
    //     console.log(JSON.stringify({
    //         action: 'create',
    //         type: model.type,
    //         organisation: this.organisation,
    //         endpoint: this.finalEndpoint(model),
    //         entity: model
    //     }, null, 2));
    // }
    //
    // update(model: ModelInterface) {
    //     console.log(JSON.stringify({
    //         action: 'update',
    //         type: model.type,
    //         organisation: this.organisation,
    //         endpoint: this.finalEndpoint(model),
    //         entity: model
    //     }, null, 2));
    // }
}