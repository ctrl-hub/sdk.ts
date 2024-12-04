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
        const dataIsArray = Array.isArray(resp.data);
        // Hydrate response based on whether it's a single item or an array
        if (dataIsArray) {
            resp.data = resp.data.map((item) => this.hydrateFunction(item, null));
        }
        else {
            resp.data = this.hydrateFunction(resp.data, null);
        }
        // Hydrate relationships
        if (dataIsArray) {
            resp.data = resp.data.map((single) => this.hydrateRelationships(single, resp.included));
        }
        else {
            resp.data = this.hydrateRelationships(resp.data, resp.included);
        }
        return resp;
    }
    hydrateRelationships(single, included) {
        if (!single.relationships)
            return single;
        Object.entries(single.relationships).forEach(([key, relationship]) => {
            const { data } = relationship;
            // relationship[key] could be array or single object
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
