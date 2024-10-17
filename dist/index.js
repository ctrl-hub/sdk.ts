// src/utils/RequestOptions.ts
class RequestOptions {
  sort;
  limit;
  offset;
  filters;
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
    if (options.filters) {
      this.filters = options.filters;
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
    if (this.filters && this.filters.length) {
      this.filters.forEach((filter) => {
        params.append(`filter[${filter.key}]`, filter.value);
      });
    }
    if (this.limit) {
      params.append("limit", this.limit.toString());
    }
    if (this.offset) {
      params.append("offset", this.offset.toString());
    }
    return params;
  }
  static fromUrl(url, defaults = {}) {
    const urlObj = new URL(url);
    const queryParams = urlObj.searchParams;
    const requestOptions = {
      filters: [],
      limit: parseInt(queryParams.get("limit") || defaults.limit?.toString() || "20"),
      offset: parseInt(queryParams.get("offset") || defaults.offset?.toString() || "0"),
      sort: defaults.sort || []
    };
    queryParams.forEach((value, key) => {
      if (key.startsWith("filter[") && key.endsWith("]")) {
        const filterKey = key.slice(7, -1);
        requestOptions.filters.push({ key: filterKey, value });
      }
      if (key === "sort") {
        requestOptions.sort = [
          {
            key: value.startsWith("-") ? value.slice(1) : value,
            direction: value.startsWith("-") ? "desc" : "asc"
          }
        ];
      }
    });
    if (!requestOptions.filters || requestOptions.filters.length === 0 && defaults.filters) {
      requestOptions.filters = defaults.filters;
    }
    return requestOptions;
  }
}

// src/models/FormCategory.ts
class FormCategory {
  id = "";
  type = "form-categories";
  attributes;
  meta = {};
  links;
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

// src/models/Role.ts
class Role {
  id = "";
  type = "roles";
  attributes;
  meta = {};
  links;
  constructor() {
    this.attributes = {
      custom: false,
      name: "",
      description: "",
      launch_stage: "",
      permissions: []
    };
  }
  static hydrate(data) {
    let role = new Role;
    if (data) {
      role.id = data.id;
      role.attributes.custom = data.attributes.custom || false;
      role.attributes.name = data.attributes.name || "";
      role.attributes.description = data.attributes.description || "";
      role.attributes.launch_stage = data.attributes.launch_stage || "";
      role.attributes.permissions = data.attributes.permissions || [];
      role.meta = data.meta || {};
    }
    return role;
  }
}

// src/models/Permission.ts
class Permission {
  id = "";
  type = "roles";
  attributes;
  meta = {};
  links;
  constructor() {
    this.attributes = {
      description: ""
    };
  }
  static hydrate(data) {
    let permission = new Permission;
    if (data) {
      permission.id = data.id;
      permission.attributes.description = data.attributes.description || "";
      permission.meta = data.meta || {};
    }
    return permission;
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
  links;
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
  links;
  constructor() {
    this.attributes = {
      client_id: ""
    };
    this.relationships = [];
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
      return json;
    let model = new modelClass;
    this.populateModelAttributes(model, json);
    return model;
  }
  hydrateRelationships(single, included) {
    if (!single.relationships)
      return single;
    Object.entries(single.relationships).forEach(([key, relationship]) => {
      const { data } = relationship;
      relationship.data = Array.isArray(data) ? data.map((relation) => this.findMatchingIncluded(relation, included) || relation) : this.findMatchingIncluded(data, included) || data;
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

// src/models/Form.ts
class Form {
  id = "";
  type = "forms";
  attributes;
  meta = {};
  links = {};
  constructor() {
    this.attributes = {
      name: "",
      description: "",
      field_mappings: [],
      status: "",
      type: ""
    };
  }
  static hydrate(data) {
    let form = new Form;
    if (data) {
      form.id = data.id || "";
      form.type = data.type || "forms";
      form.attributes.name = data.attributes.name || "";
      form.attributes.description = data.attributes.description || "";
      form.attributes.field_mappings = data.attributes.field_mappings || [];
      form.attributes.type = data.attributes.type || "";
      form.attributes.status = data.attributes.status || "";
      form.meta = data.meta || {};
      form.links = data.links || {};
    }
    return form;
  }
}

// src/models/Submission.ts
class Submission {
  id = "";
  type = "submissions";
  attributes;
  meta = {};
  links = {};
  relationships;
  constructor() {
    this.attributes = {
      reference: "",
      status: ""
    };
  }
  static hydrate(data) {
    let submission = new Submission;
    if (data) {
      submission.id = data.id || "";
      submission.type = data.type || "submissions";
      submission.attributes.reference = data.attributes.reference || "";
      submission.attributes.status = data.attributes.status || "";
      submission.meta = data.meta || {};
      submission.links = data.links || {};
      submission.relationships = data.relationships || {};
    }
    return submission;
  }
}

// src/services/Client.ts
class Client {
  config;
  organisation;
  services = {};
  hydrator;
  submissions;
  forms;
  formCategories;
  roles;
  permissions;
  serviceAccounts;
  constructor(config) {
    this.config = config;
    this.organisation = "";
    this.services["formCategories"] = {
      endpoint: "/v3/orgs/:orgId/data-capture/form-categories",
      model: FormCategory,
      type: "form-categories"
    };
    this.services["forms"] = {
      endpoint: "/v3/orgs/:orgId/data-capture/forms",
      model: Form,
      type: "forms"
    };
    this.services["submissions"] = {
      endpoint: "/v3/orgs/:orgId/data-capture/submissions",
      model: Submission,
      type: "submissions"
    };
    this.services["permissions"] = {
      endpoint: "/v3/admin/permissions",
      model: Permission,
      type: "permissions"
    };
    this.services["roles"] = {
      endpoint: "/v3/admin/iam/roles",
      model: Role,
      type: "roles"
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
  async create(model) {
    let service = Object.values(this.services).find((service2) => service2.type === model.type);
    if (!service) {
      throw new Error(`Service not found for model type ${model.type}`);
    }
    let requestBody = {
      data: {
        attributes: model.attributes,
        type: model.type
      }
    };
    let endpoint = this.finalEndpoint(service);
    return await this.makePostRequest(endpoint, requestBody);
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
  async makePostRequest(baseEndpoint, body, param, headers) {
    let url = Requests.buildRequestURL(baseEndpoint, param);
    try {
      const fetchResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        credentials: "include",
        body: JSON.stringify(body)
      });
      let json = await fetchResponse.json();
      return Requests.buildInternalResponse(fetchResponse, json);
    } catch (error) {
      return Requests.buildInternalErrorResponse(error);
    }
  }
  async makeGetRequest(baseEndpoint, param) {
    let url = Requests.buildRequestURL(baseEndpoint, param);
    try {
      const fetchResponse = await fetch(url, {
        credentials: "include"
      });
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
  ServiceAccount,
  RequestOptions,
  ClientConfig,
  Client
};
