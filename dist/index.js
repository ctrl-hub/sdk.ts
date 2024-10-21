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
      client_id: "",
      enabled: false
    };
    this.relationships = [];
  }
  static hydrate(data, fullResponseData) {
    let serviceAccountKey = new ServiceAccountKey;
    if (data) {
      serviceAccountKey.id = data.id;
      serviceAccountKey.attributes.client_id = data.attributes.client_id || "";
      serviceAccountKey.attributes.enabled = data.attributes.enabled;
      serviceAccountKey.meta = data.meta || {};
    }
    return serviceAccountKey;
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

// src/services/BaseService.ts
class BaseService {
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
    let endpoint = this.client.finalEndpoint(this.endpoint);
    let resp = await this.client.makeGetRequest(endpoint, param);
    const dataIsArray = Array.isArray(resp.data);
    if (dataIsArray) {
      resp.data = resp.data.map((item) => this.hydrateFunction(item, null));
    } else {
      resp.data = this.hydrateFunction(resp.data, null);
    }
    if (dataIsArray) {
      resp.data = resp.data.map((single) => this.hydrateRelationships(single, resp.included));
    } else {
      resp.data = this.hydrateRelationships(resp.data, resp.included);
    }
    return resp;
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
  findMatchingIncluded(relation, included) {
    return included.find((inc) => inc.id === relation.id && inc.type === relation.type);
  }
}

// src/services/FormCategoriesService.ts
class FormCategoriesService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/data-capture/form-categories", FormCategory.hydrate);
  }
}

// src/services/RolesService.ts
class RolesService extends BaseService {
  constructor(client) {
    super(client, "/v3/admin/iam/roles", Role.hydrate);
  }
}

// src/services/PermissionsService.ts
class PermissionsService extends BaseService {
  constructor(client) {
    super(client, "/v3/admin/permissions", Permission.hydrate);
  }
}

// src/services/SubmissionsService.ts
class SubmissionsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/data-capture/submissions", Submission.hydrate);
  }
}

// src/services/FormsService.ts
class FormsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/data-capture/forms", Form.hydrate);
  }
}

// src/models/Log.ts
class Log {
  id = "";
  type = "logs";
  attributes;
  meta = {};
  relationships;
  links;
  constructor() {
    this.attributes = {
      actor: {
        type: "",
        id: ""
      },
      duration: 0,
      request: {
        time: "",
        headers: {},
        body: "",
        path: "",
        query: {},
        raw_query: "",
        method: "",
        content_length: 0
      },
      response: {
        time: "",
        body: "",
        headers: {},
        status: 0
      }
    };
    this.relationships = [];
    this.links = {};
  }
  static hydrate(data, fullResponseData) {
    let log = new Log;
    if (data) {
      log.id = data.id;
      log.attributes.actor = data.attributes.actor || { type: "", id: "" };
      log.attributes.duration = data.attributes.duration || 0;
      log.attributes.request = data.attributes.request || {
        time: "",
        headers: {},
        body: "",
        path: "",
        query: {},
        raw_query: "",
        method: "",
        content_length: 0
      };
      log.attributes.response = data.attributes.response || {
        time: "",
        body: "",
        headers: {},
        status: 0
      };
      log.meta = data.meta || {};
      log.links = data.links || {};
    }
    return log;
  }
}

// src/services/ServiceAccountService.ts
class ServiceAccountsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/admin/iam/service-accounts", ServiceAccount.hydrate);
  }
  async createKey(serviceAccount) {
    let createKeyEndpoint = this.client.finalEndpoint(this.endpoint + "/" + serviceAccount.id + "/keys");
    return await this.client.makePostRequest(createKeyEndpoint, {
      data: {
        type: "service-account-keys"
      }
    });
  }
  async create(serviceAccount) {
    let createKeyEndpoint = this.client.finalEndpoint(this.endpoint);
    return await this.client.makePostRequest(createKeyEndpoint, {
      data: {
        type: serviceAccount.type,
        attributes: {
          name: serviceAccount.attributes.name,
          description: serviceAccount.attributes.description
        }
      }
    });
  }
  async logs(id) {
    const logsEndpoint = this.client.finalEndpoint(`${this.endpoint}/${id}/logs`);
    const resp = await this.client.makeGetRequest(logsEndpoint);
    resp.data = resp.data.map((log) => Log.hydrate(log, null));
    return resp;
  }
}

// src/services/ServiceAccountKeysService.ts
class ServiceAccountKeysService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/admin/iam/service-accounts", ServiceAccountKey.hydrate);
  }
}

// src/Client.ts
class Client {
  config;
  organisation;
  services = {};
  hydrator;
  bearerToken = "";
  tokenPromise = null;
  constructor(config) {
    this.config = config;
    this.organisation = "";
    this.hydrator = new Hydrator(this.services);
    if (config.clientId && config.clientSecret && config.authUrl) {
      this.tokenPromise = this.getToken();
    }
  }
  async getToken() {
    const url = this.config.authUrl || "";
    const params = new URLSearchParams;
    params.append("grant_type", "client_credentials");
    params.append("client_id", this.config.clientId || "");
    params.append("client_secret", this.config.clientSecret || "");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
      },
      body: params.toString()
    });
    let tokenJson = await response.json();
    if (tokenJson.access_token) {
      this.bearerToken = tokenJson.access_token;
    }
  }
  async ensureAuthenticated() {
    if (this.tokenPromise) {
      await this.tokenPromise;
      this.tokenPromise = null;
    }
  }
  roles() {
    return new RolesService(this);
  }
  serviceAccountKeys() {
    return new ServiceAccountKeysService(this);
  }
  serviceAccounts() {
    return new ServiceAccountsService(this);
  }
  formCategories() {
    return new FormCategoriesService(this);
  }
  forms() {
    return new FormsService(this);
  }
  submissions() {
    return new SubmissionsService(this);
  }
  permissions() {
    return new PermissionsService(this);
  }
  setOrganisationSlug(organisation) {
    this.config.organisationId = organisation;
  }
  finalEndpoint(url) {
    return `${this.config.baseDomain}${url.replace(":orgId", this.config.organisationId.toString())}`;
  }
  async makePostRequest(baseEndpoint, body, param) {
    await this.ensureAuthenticated();
    let url = Requests.buildRequestURL(baseEndpoint, param);
    let headers = {
      "Content-Type": "application/json"
    };
    if (this.bearerToken) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    }
    try {
      const fetchResponse = await fetch(url, {
        method: "POST",
        headers,
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
    await this.ensureAuthenticated();
    let url = Requests.buildRequestURL(baseEndpoint, param);
    let headers = {
      "Content-Type": "application/json"
    };
    if (this.bearerToken) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    }
    try {
      const fetchResponse = await fetch(url, {
        credentials: "include",
        headers
      });
      let json = await fetchResponse.json();
      return Requests.buildInternalResponse(fetchResponse, json);
    } catch (error) {
      return Requests.buildInternalErrorResponse(error);
    }
  }
}
// src/ClientConfig.ts
class ClientConfig {
  organisationId;
  baseDomain;
  clientId;
  clientSecret;
  authUrl;
  constructor(config) {
    this.organisationId = config.organisationId;
    this.baseDomain = config.baseDomain || "https://app.ctrl-hub.com";
    this.clientId = config.clientId || "";
    this.clientSecret = config.clientSecret || "";
    this.authUrl = config.authUrl || "";
  }
}
export {
  ServiceAccountKey,
  ServiceAccount,
  RequestOptions,
  Log,
  ClientConfig,
  Client
};
