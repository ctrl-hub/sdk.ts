import { ClientConfig } from "./ClientConfig";
import { ClientInterface } from "../interfaces/ClientInterface";
import { RequestOptions } from "../utils/RequestOptions";
import { FormCategoryService } from "./FormCategoryService";

export class Client {
    readonly config: ClientConfig;
    public organisation: string;
    public formCategories: FormCategoryService;

    constructor(config: ClientConfig) {
        this.config = config;
        this.formCategories = new FormCategoryService(this);
    }

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

    async makeGetRequest(baseEndpoint: string, param?: string | RequestOptions | null) {
        let url = this.buildRequestURL(baseEndpoint, param);
        let response = await fetch(url);
        return response.json();
    }

    hydrateResponse(json: any, model: ClientInterface) {
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