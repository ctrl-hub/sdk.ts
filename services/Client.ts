import { ClientConfig } from "./ClientConfig";
import { ClientInterface } from "../interfaces/ClientInterface";
import { RequestOptions } from "../utils/RequestOptions";
import { FormCategoryService } from "./FormCategoryService";
import type { InternalResponse } from "../interfaces/ResponseInterface"

export class Client {
    readonly config: ClientConfig;
    public organisation: string;
    // public resources: any[]
    public formCategories: FormCategoryService;

    constructor(config: ClientConfig) {
        this.config = config;
        // this.addResource('form-categories', 'formCategories', FormCategoryService)
        this.formCategories = new FormCategoryService(this);
    }

    // addResource(key: string, accessName: string, entity: any) {
    //     this.resources[key] = new entity(this)
    //     this[accessName] = this.resources[key]
    // }

    setOrganisationSlug(organisation: string) {
        this.config.organisationId = organisation;
    }

    finalEndpoint(model: ClientInterface): string {
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

    async makeGetRequest(baseEndpoint: string, param?: string | RequestOptions | null): Promise<InternalResponse> {
        let url = this.buildRequestURL(baseEndpoint, param);

        try {
            const response = await fetch(url);
            const data = await response.json().catch(() => null);
            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            return {
                ok: response.ok,
                statusCode: response.status,
                headers,
                data: data.data,
                errors: {
                    client: [],
                    network: [],
                    api: [],
                },
                meta: data.meta,
                links: {},
                included: []
            };
        } catch (error) {
            return {
                ok: false,
                statusCode: 0,
                headers: [],
                data: null,
                errors: {
                    client: [],
                    network: [error],
                    api: [],
                },
                meta: null,
                links: {},
                included: []
            };
        }
    }

    // @todo should not rely directly on model, infer from model "type"
    hydrateResponse(json: any) {
        if (Array.isArray(json.data)) {
            json.data.forEach((j: any) => console.log(j.attributes.name));
        } else {
            console.log(json.data.attributes.name);
        }
    }

    create(model: ClientInterface) {
        console.log(JSON.stringify({
            action: 'create',
            type: model.type,
            organisation: this.organisation,
            endpoint: this.finalEndpoint(model),
            entity: model
        }, null, 2));
    }

    update(model: ClientInterface) {
        console.log(JSON.stringify({
            action: 'update',
            type: model.type,
            organisation: this.organisation,
            endpoint: this.finalEndpoint(model),
            entity: model
        }, null, 2));
    }
}