import { Client } from "../Client";
import { RequestOptions } from "../utils/RequestOptions";
import { ModelRegistry } from "../utils/ModelRegistry";
import { Hydrator } from "../utils/Hydrator";
export class BaseService {
    client;
    endpoint;
    modelRegistry;
    hydrator;
    constructor(client, endpoint) {
        this.client = client;
        this.endpoint = endpoint;
        this.modelRegistry = ModelRegistry.getInstance();
        this.hydrator = new Hydrator(this.modelRegistry);
    }
    async get(param) {
        // Make the request and type the response
        let endpoint = this.client.finalEndpoint(this.endpoint);
        let requestParam;
        if (typeof param === 'string') {
            requestParam = param;
        }
        else if (typeof param === 'object') {
            // If param is an object, convert it to RequestOptions
            requestParam = new RequestOptions(param);
        }
        let resp = await this.client.makeGetRequest(endpoint, requestParam);
        resp.data = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        return resp;
    }
    async create(model) {
        let createEndpoint = this.client.finalEndpoint(this.endpoint);
        return await this.client.makePostRequest(createEndpoint, {
            data: {
                type: model.type,
                attributes: model.attributes,
                relationships: model.relationships,
            }
        });
    }
}
