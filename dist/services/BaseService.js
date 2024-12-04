import { RequestOptions } from "../utils/RequestOptions";
import { Form } from "../models/Form";
import { FormCategory } from "../models/FormCategory";
import { Role } from "../models/Role";
import { ServiceAccount } from "../models/ServiceAccount";
import { ServiceAccountKey } from "../models/ServiceAccountKey";
import { Submission } from "../models/Submission";
import { Permission } from "../models/Permission";
export class BaseService {
    client;
    endpoint;
    hydrateFunction;
    services = {};
    models = {};
    constructor(client, endpoint, hydrateFunction) {
        this.client = client;
        this.endpoint = endpoint;
        this.hydrateFunction = hydrateFunction;
        this.models["form-categories"] = FormCategory;
        this.models["forms"] = Form;
        this.models["submissions"] = Submission;
        this.models["permissions"] = Permission;
        this.models["roles"] = Role;
        this.models["service-accounts"] = ServiceAccount;
        this.models["service-account-keys"] = ServiceAccountKey;
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
        // hydrate the model(s) in resp.data
        // hydrate model relationships from the data in resp.includes
        resp.data = Array.isArray(resp.data)
            ? this.hydrateDataArray(resp.data, resp.included)
            : this.hydrateSingleItem(resp.data, resp.included);
        return resp;
    }
    hydrateModel(item) {
        return this.hydrateFunction(item, null);
    }
    hydrateDataArray(items, included) {
        return items
            .map(item => this.hydrateModel(item))
            .map(item => this.hydrateRelationships(item, included));
    }
    hydrateSingleItem(item, included) {
        const hydrated = this.hydrateModel(item);
        return this.hydrateRelationships(hydrated, included);
    }
    hydrateRelationships(single, included) {
        if (!single.relationships || !included)
            return single;
        Object.entries(single.relationships).forEach(([key, relationship]) => {
            const { data } = relationship;
            // Hydrate arrays or single items from included data
            relationship.data = Array.isArray(data)
                ? data.map(relation => this.findMatchingIncluded(relation, included) || relation)
                : this.findMatchingIncluded(data, included) || data;
        });
        return single;
    }
    findMatchingIncluded(relation, included) {
        return included?.find(inc => inc.id === relation.id && inc.type === relation.type);
    }
}
