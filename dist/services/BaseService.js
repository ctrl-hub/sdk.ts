import { Client } from "../Client";
import { Hydrator } from "../utils/Hydrator";
import { RequestBuilder } from '../utils/RequestBuilder';
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
        if ('getApiMapping' in model.constructor.prototype) {
            const mapping = model.constructor.prototype.getApiMapping();
            const payload = {
                data: {
                    type: model.type,
                    attributes: {},
                    relationships: {}
                }
            };
            mapping.attributes?.forEach((attr) => {
                payload.data.attributes[attr] = model[attr];
            });
            if (mapping.relationships) {
                Object.entries(mapping.relationships).forEach(([key, type]) => {
                    const relationshipValue = model[key];
                    if (relationshipValue) {
                        payload.data.relationships[key] = {
                            data: {
                                type,
                                id: relationshipValue
                            }
                        };
                    }
                });
            }
            return await this.client.makePostRequest(this.endpoint, payload);
        }
        // default to using all attributes (anything that's not type or id)
        const { type, id, ...attributes } = model;
        return await this.client.makePostRequest(this.endpoint, {
            data: {
                type: model.type,
                attributes
            }
        });
    }
}
