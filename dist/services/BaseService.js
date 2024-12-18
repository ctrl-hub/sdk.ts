import { Client } from "../Client";
import { Hydrator } from "../utils/Hydrator";
import { RequestBuilder } from '../utils/RequestBuilder';
import { JsonApiSerializer } from '@utils/JsonSerializer';
export class BaseService extends RequestBuilder {
    client;
    endpoint;
    hydrator;
    constructor(client, endpoint) {
        super();
        this.client = client;
        this.endpoint = endpoint;
        this.hydrator = new Hydrator();
    }
    async get(param, options) {
        const { endpoint, requestOptions } = this.buildRequestParams(this.endpoint, param, options);
        let resp = await this.client.makeGetRequest(endpoint, requestOptions);
        const hydratedData = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        return {
            ...resp,
            data: hydratedData
        };
    }
    async create(model) {
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildCreatePayload(model);
        return await this.client.makePostRequest(this.endpoint, payload);
    }
}
