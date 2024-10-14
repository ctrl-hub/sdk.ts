// src/utils/RequestOptions.ts
class RequestOptions {
  sort;
  limit;
  offset;
  constructor(options) {
    if (options.sort) {
      this.sort = options.sort;
    }
    if (options.limit) {
      this.limit = options.limit;
    }
    if (options.offset) {
      this.offset = options.offset;
    }
  }
  toURLSearchParams() {
    let params = new URLSearchParams;
    if (this.sort && this.sort.length) {
      let sortString = this.sort.map((sort) => {
        return (sort.direction === "desc" ? "-" : "") + sort.key;
      }).join(",");
      params.append("sort", sortString);
    }
    if (this.limit) {
      params.append("limit", this.limit.toString());
    }
    if (this.offset) {
      params.append("offset", this.offset.toString());
    }
    return params;
  }
}

// src/models/FormCategory.ts
class FormCategory {
  id = "";
  type = "form-categories";
  attributes;
  meta = {};
  constructor() {
    this.attributes = {
      name: ""
    };
  }
  static hydrate(data) {
    let formCategory = new FormCategory;
    if (data) {
      formCategory.id = data.id;
      formCategory.attributes.name = data.attributes.name || "";
      formCategory.meta = data.meta || {};
    }
    return formCategory;
  }
}

// src/utils/Requests.ts
class Requests {
  static buildRequestURL(baseEndpoint, param) {
    let endpoint = baseEndpoint;
    if (param instanceof RequestOptions) {
      endpoint += `?${param.toURLSearchParams().toString()}`;
    } else if (typeof param === "string") {
      endpoint += `/${param}`;
    }
    return endpoint;
  }
  static buildInternalResponse(fetchResponse, json) {
    return {
      ok: fetchResponse.ok,
      statusCode: fetchResponse.status,
      headers: fetchResponse.headers,
      meta: json?.meta || null,
      links: json?.links || null,
      data: json?.data || null,
      included: json?.included || null,
      errors: {
        client: [],
        network: [],
        api: json?.errors || []
      }
    };
  }
  static buildInternalErrorResponse(error) {
    return {
      ok: false,
      statusCode: error.statusCode || 0,
      headers: error.headers,
      data: null,
      errors: {
        client: [],
        network: [error],
        api: []
      },
      meta: null,
      links: {},
      included: []
    };
  }
}

// src/models/ServiceAccount.ts
class ServiceAccount {
  id = "";
  type = "service-accounts";
  attributes;
  meta = {};
  relationships;
  constructor() {
    this.attributes = {
      name: "",
      description: "",
      email: "",
      enabled: false
    };
  }
  static hydrate(data, fullResponseData) {
    let serviceAccount = new ServiceAccount;
    if (data) {
      serviceAccount.id = data.id;
      serviceAccount.attributes.name = data.attributes.name || "";
      serviceAccount.attributes.description = data.attributes.description || "";
      serviceAccount.attributes.email = data.attributes.email || "";
      serviceAccount.attributes.enabled = data.attributes.enabled || false;
      serviceAccount.meta = data.meta || {};
      serviceAccount.relationships = data.relationships || {};
    }
    return serviceAccount;
  }
}

// src/models/ServiceAccountKey.ts
class ServiceAccountKey {
  id = "";
  type = "service-account-keys";
  attributes;
  meta = {};
  relationships;
  constructor() {
    this.attributes = {
      client_id: ""
    };
  }
  static hydrate(data, fullResponseData) {
    let serviceAccountKey = new ServiceAccountKey;
    if (data) {
      serviceAccountKey.id = data.id;
      serviceAccountKey.attributes.client_id = data.attributes.client_id || "";
      serviceAccountKey.meta = data.meta || {};
    }
    return serviceAccountKey;
  }
}

// src/utils/Hydrator.ts
class Hydrator {
  services;
  constructor(services) {
    this.services = services;
  }
  hydrateResponse(service, response) {
    if (!response.included && !response.data)
      return response;
    if (response.included) {
      response.included = response.included.map((json) => this.hydrateJson(json));
    }
    const isArray = Array.isArray(response.data);
    const data = Array.isArray(response.data) ? response.data : [response.data];
    const ModelClass = service.model;
    response.data = data.map((item) => ModelClass.hydrate(item, response));
    response.data = response.data.map((single) => this.hydrateRelationships(single, response.included));
    if (!isArray) {
      response.data = response.data[0];
    }
    return response;
  }
  hydrateJson(json) {
    const modelClass = this.findServiceModel(json.type);
    if (!modelClass)
      return null;
    let model = new modelClass;
    this.populateModelAttributes(model, json);
    return model;
  }
  hydrateRelationships(single, included) {
    if (!single.relationships)
      return single;
    let relationships = single.relationships;
    Object.keys(relationships).forEach((key) => {
      relationships[key].data = relationships[key].data.map((relation) => this.findMatchingIncluded(relation, included) || relation);
    });
    return single;
  }
  populateModelAttributes(model, json) {
    model.id = json.id;
    model.attributes = json.attributes || {};
    model.relationships = json.relationships || [];
    model.meta = json.meta || {};
    model.links = json.links || [];
  }
  findServiceModel(type) {
    return Object.values(this.services).find((service) => service.type === type)?.model;
  }
  findMatchingIncluded(relation, included) {
    return included.find((inc) => inc.id === relation.id && inc.type === relation.type);
  }
}

// src/services/Client.ts
class Client {
  config;
  organisation;
  services = {};
  formCategories;
  hydrator;
  serviceAccounts;
  constructor(config) {
    this.config = config;
    this.organisation = "";
    this.services["formCategories"] = {
      endpoint: "/v3/orgs/:orgId/data-capture/form-categories",
      model: FormCategory,
      type: "form-categories"
    };
    this.services["serviceAccounts"] = {
      endpoint: "/v3/orgs/:orgId/admin/iam/service-accounts",
      model: ServiceAccount,
      type: "service-accounts"
    };
    this.services["serviceAccountKeys"] = {
      endpoint: "/v3/orgs/:orgId/admin/iam/service-accounts",
      model: ServiceAccountKey,
      type: "service-account-keys"
    };
    this.hydrator = new Hydrator(this.services);
    return this.setupProxies();
  }
  setOrganisationSlug(organisation) {
    this.config.organisationId = organisation;
  }
  finalEndpoint(service) {
    return `${this.config.baseDomain}${service.endpoint.replace(":orgId", this.config.organisationId.toString())}`;
  }
  setupProxies() {
    return new Proxy(this, {
      get: (client, service) => {
        if (service in client.services) {
          const serviceInfo = client.services[service];
          return new Proxy({}, {
            get: (_, method) => {
              if (method === "get") {
                return (param) => {
                  if (typeof param === "string") {
                    return client.getResource(serviceInfo, param);
                  }
                  const requestOptions = param ? new RequestOptions(param) : null;
                  return client.getResource(serviceInfo, requestOptions);
                };
              }
              return () => `Method ${method.toString()} called on service ${service}`;
            }
          });
        }
        return Reflect.get(client, service);
      }
    });
  }
  async makeGetRequest(baseEndpoint, param) {
    let url = Requests.buildRequestURL(baseEndpoint, param);
    try {
      const fetchResponse = await fetch(url);
      let json = await fetchResponse.json();
      return Requests.buildInternalResponse(fetchResponse, json);
    } catch (error) {
      return Requests.buildInternalErrorResponse(error);
    }
  }
  async getResource(service, param) {
    const response = await this.makeGetRequest(this.finalEndpoint(service), param);
    return this.hydrator.hydrateResponse(service, response);
  }
}
// src/services/ClientConfig.ts
class ClientConfig {
  organisationId;
  baseDomain;
  constructor(config) {
    this.organisationId = config.organisationId;
    this.baseDomain = config.baseDomain || "https://app.ctrl-hub.com";
  }
}
export {
  ClientConfig,
  Client
};