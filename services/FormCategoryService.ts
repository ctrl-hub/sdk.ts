import { RequestOptions } from "../utils/RequestOptions";
import { FormCategory } from "../models/FormCategory";
import { Client } from "./Client";
import {InternalResponse} from "../interfaces/ResponseInterface";
import {ModelServiceInterface} from "../interfaces/ModelServiceInterface";

export class FormCategoryService implements ModelServiceInterface {
    private client: Client;
    id: "formCategories"
    public endpoint: string = '/v3/orgs/:orgId/data-capture/form-categories';

    constructor(client: Client) {
        this.client = client;
    }

    async get(param?: string | RequestOptions | null): Promise<any> {
        let model = new FormCategory();
        let baseEndpoint = this.client.finalEndpoint(this);

        try {
            // Make the request and get the full raw response
            const response: InternalResponse = await this.client.makeGetRequest(baseEndpoint, param);

            // Handle errors based on response
            if (!response.ok || response.statusCode >= 400) {
                return {
                    data: null,
                    meta: response.meta || {},
                    links: response.links || {},
                    headers: response.headers || {},
                    included: response.included || [],
                    errors: response.errors,
                    ok: response.ok,
                    statusCode: response.statusCode
                };
            }

            // If the request was successful, process the data
            let data: FormCategory[] | FormCategory;
            if (Array.isArray(response.data)) {
                // Map over array and create `FormCategory` instances
                data = response.data.map(item => {
                    return new FormCategory(item.attributes, item.id, item.type, item.meta);
                });
            } else {
                // Single `FormCategory` instance
                const item = response.data as any;
                data = new FormCategory(item.attributes, item.id, item.type, item.meta);
            }

            response.data = data;

            // Return the successful response
            return {
                data,
                meta: response.meta || {},
                links: response.links || {},
                headers: response.headers || {},
                included: response.included || [],
                errors: {
                    client: [],
                    network: [],
                    api: []
                },
                ok: true,
                statusCode: response.statusCode
            };

        } catch (error) {
            return {
                data: null, // No data on error
                meta: {}, // Default empty meta
                links: {}, // Default empty links
                headers: {}, // Default empty headers
                included: [], // Default empty included
                errors: {
                    client: [],
                    network: [error], // Capture network error
                    api: []
                },
                ok: false, // Request failed
                statusCode: 0 // Network errors typically don't have a status code, so use 0
            };
        }
    }
}