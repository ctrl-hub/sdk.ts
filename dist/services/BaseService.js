import { Client } from "../Client";
import { ModelRegistry } from "../utils/ModelRegistry";
import { Hydrator } from "../utils/Hydrator";
import { RequestBuilder } from '../utils/RequestBuilder';
export class BaseService extends RequestBuilder {
    client;
    endpoint;
    modelRegistry;
    hydrator;
    constructor(client, endpoint) {
        super();
        this.client = client;
        this.endpoint = endpoint;
        this.modelRegistry = ModelRegistry.getInstance();
        this.hydrator = new Hydrator(this.modelRegistry);
    }
    async get(param, options) {
        const { endpoint, requestOptions } = this.buildRequestParams(this.endpoint, param, options);
        let resp = await this.client.makeGetRequest(endpoint, requestOptions);
        resp.data = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        this.clearRequestOptions();
        return resp;
    }
    async create(model) {
        return await this.client.makePostRequest(this.endpoint, {
            data: {
                type: model.type,
                attributes: model.attributes,
                relationships: model.relationships,
            }
        });
    }
}
