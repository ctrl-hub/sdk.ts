import { Client } from '../Client';
import { Hydrator } from '../utils/Hydrator';
import { RequestBuilder } from '../utils/RequestBuilder';
import { JsonApiSerializer } from '../utils/JsonSerializer';
export class BaseService extends RequestBuilder {
    client;
    endpoint;
    hydrator;
    jsonApiSerializer;
    constructor(client, endpoint) {
        super();
        this.client = client;
        this.endpoint = endpoint;
        this.hydrator = new Hydrator();
        this.jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
    }
    convertToJsonApi(model) {
        return this.jsonApiSerializer.buildCreatePayload(model);
    }
    async get(param, options) {
        const { endpoint, requestOptions } = this.buildRequestParams(this.endpoint, param, options);
        let resp = await this.client.makeGetRequest(endpoint, requestOptions);
        const hydratedData = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        return {
            ...resp,
            data: hydratedData,
        };
    }
    async create(model, params) {
        if (params) {
        }
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildCreatePayload(model);
        let resp = await this.client.makePostRequest(this.endpoint, payload);
        const hydratedData = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        return {
            ...resp,
            data: hydratedData,
        };
    }
    async update(id, model, params) {
        if (params) {
        }
        const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
        const payload = jsonApiSerializer.buildUpdatePayload(model);
        let resp = await this.client.makePatchRequest(`${this.endpoint}/${id}`, payload);
        const hydratedData = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        return {
            ...resp,
            data: hydratedData,
        };
    }
    async stats(options) {
        const statsEndpoint = `${this.endpoint}/stats`;
        const { requestOptions } = this.buildRequestParams('', options);
        const resp = await this.client.makeGetRequest(statsEndpoint, requestOptions);
        if (resp.data && typeof resp.data === 'object') {
            resp.data = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        }
        return resp;
    }
}
