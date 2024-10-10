import { RequestOptions } from "../utils/RequestOptions";
import { FormCategory } from "../models/FormCategory";
import { Client } from "./Client";

export class FormCategoryService {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    async get(param?: string | RequestOptions | null) {
        let model = new FormCategory();
        let baseEndpoint = this.client.finalEndpoint(model);
        return await this.client.makeGetRequest(baseEndpoint, param);
    }
}