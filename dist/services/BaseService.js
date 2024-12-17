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
        const hydratedData = this.hydrator.hydrateResponse(resp.data, resp.included || []);
        return {
            ...resp,
            data: hydratedData
        };
    }
    async create(model) {
        let modelType = model.type;
        let ModelClass = this.modelRegistry.models[modelType];
        let payload;
        if ('getApiMapping' in ModelClass.prototype) {
            const mapping = ModelClass.prototype.getApiMapping();
            payload = {
                data: {
                    type: model.type,
                    attributes: {}
                }
            };
            mapping.attributes.forEach((attr) => {
                payload.data.attributes[attr] = model[attr];
            });
            if (mapping.relationships) {
                payload.data.relationships = {};
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
        }
        else {
            let { type, id, ...rest } = model;
            payload = {
                data: {
                    type: model.type,
                    attributes: rest
                }
            };
        }
        return await this.client.makePostRequest(this.endpoint, payload);
    }
}
