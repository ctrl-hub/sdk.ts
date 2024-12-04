// src/utils/RequestOptions.ts
class RequestOptions {
  sort;
  limit;
  offset;
  filters;
  include = [];
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
    if (options.include) {
      this.include = options.include;
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
    if (this.include && this.include.length) {
      params.append("include", this.include.join(","));
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
      sort: defaults.sort || [],
      include: defaults.include || []
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
  relationships;
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
      form.relationships = data.relationships || {};
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
      submission.relationships = data.relationships || {};
      submission.attributes.reference = data.attributes.reference || "";
      submission.attributes.status = data.attributes.status || "";
      submission.meta = data.meta || {};
      submission.links = data.links || {};
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
    let requestParam;
    if (typeof param === "string") {
      requestParam = param;
    } else if (typeof param === "object") {
      requestParam = new RequestOptions(param);
    }
    let resp = await this.client.makeGetRequest(endpoint, requestParam);
    resp.data = Array.isArray(resp.data) ? this.hydrateDataArray(resp.data, resp.included) : this.hydrateSingleItem(resp.data, resp.included);
    return resp;
  }
  hydrateModel(item) {
    return this.hydrateFunction(item, null);
  }
  hydrateDataArray(items, included) {
    return items.map((item) => this.hydrateModel(item)).map((item) => this.hydrateRelationships(item, included));
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
      relationship.data = Array.isArray(data) ? data.map((relation) => this.findMatchingIncluded(relation, included) || relation) : this.findMatchingIncluded(data, included) || data;
    });
    return single;
  }
  findMatchingIncluded(relation, included) {
    return included?.find((inc) => inc.id === relation.id && inc.type === relation.type);
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
    super(client, "/v3/iam/roles", Role.hydrate);
  }
}

// src/services/PermissionsService.ts
class PermissionsService extends BaseService {
  constructor(client) {
    super(client, "/v3/iam/permissions", Permission.hydrate);
  }
}

// src/models/SubmissionVersion.ts
class SubmissionVersion {
  id = "";
  type = "submission-versions";
  attributes;
  meta = {};
  links = {};
  relationships;
  constructor() {
    this.attributes = {
      author: "",
      form: "",
      form_version: "",
      reference: "",
      status: "",
      content: {}
    };
  }
  static hydrate(data) {
    let submissionVersion = new SubmissionVersion;
    if (data) {
      submissionVersion.id = data.id || "";
      submissionVersion.type = data.type || "submissions";
      submissionVersion.attributes.author = data.attributes.author || "";
      submissionVersion.attributes.form = data.attributes.form || "";
      submissionVersion.attributes.form_version = data.attributes.form_version || "";
      submissionVersion.attributes.reference = data.attributes.reference || "";
      submissionVersion.attributes.status = data.attributes.status || "";
      submissionVersion.attributes.content = data.attributes.content || {};
      submissionVersion.meta = data.meta || {};
      submissionVersion.links = data.links || {};
      submissionVersion.relationships = data.relationships || {};
    }
    return submissionVersion;
  }
}

// src/services/SubmissionsService.ts
class SubmissionsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/data-capture/submissions", Submission.hydrate);
  }
  async getVersions(submissionId) {
    const versionsEndpoint = this.client.finalEndpoint(`${this.endpoint}/${submissionId}/relationships/versions`);
    const resp = await this.client.makeGetRequest(versionsEndpoint);
    resp.data = resp.data.map((submissionVersion) => SubmissionVersion.hydrate(submissionVersion));
    return resp;
  }
  async getVersion(submissionId, versionId) {
    const versionEndpoint = this.client.finalEndpoint(`${this.endpoint}/${submissionId}/relationships/versions/${versionId}`);
    const resp = await this.client.makeGetRequest(versionEndpoint);
    resp.data = SubmissionVersion.hydrate(resp.data);
    return resp;
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
    super(client, "/v3/orgs/:orgId/iam/service-accounts", ServiceAccount.hydrate);
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
    super(client, "/v3/orgs/:orgId/iam/service-accounts", ServiceAccountKey.hydrate);
  }
}

// src/models/Group.ts
class Group {
  id = "";
  type = "groups";
  attributes;
  meta = {};
  links = {};
  constructor() {
    this.attributes = {
      name: "",
      description: "",
      bindings: []
    };
  }
  static hydrate(data) {
    let group = new Group;
    if (data) {
      group.id = data.id || "";
      group.type = data.type || "groups";
      group.attributes.name = data.attributes?.name || "";
      group.attributes.description = data.attributes?.description || "";
      group.attributes.bindings = data.attributes?.bindings || [];
      group.meta = data.meta || {};
      group.links = data.links || {};
    }
    return group;
  }
}

// src/services/GroupService.ts
class GroupsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/iam/groups", Group.hydrate);
  }
  async deleteBinding(groupId, bindingId) {
    let deleteEndpoint = this.client.finalEndpoint(this.endpoint + "/" + groupId + "/bindings/" + bindingId);
    return await this.client.makeDeleteRequest(deleteEndpoint);
  }
  async createBinding(groupId, body) {
    let createBindingEndpoint = this.client.finalEndpoint(this.endpoint + "/" + groupId + "/bindings");
    return await this.client.makePostRequest(createBindingEndpoint, {
      data: {
        type: "bindings",
        attributes: JSON.parse(body)
      }
    });
  }
}

// src/models/Vehicle.ts
class Vehicle {
  id = "";
  type = "vehicles";
  attributes;
  meta = {};
  links = {};
  relationships;
  constructor() {
    this.attributes = {
      registration: "",
      vin: "",
      description: ""
    };
  }
  static hydrate(data) {
    let vehicle = new Vehicle;
    if (data) {
      vehicle.id = data.id || "";
      vehicle.type = data.type || "vehicles";
      vehicle.relationships = data.relationships || {};
      vehicle.attributes.registration = data.attributes.registration || "";
      vehicle.attributes.vin = data.attributes.vin || "";
      vehicle.attributes.description = data.attributes.description || "";
      vehicle.meta = data.meta || {};
      vehicle.links = data.links || {};
    }
    return vehicle;
  }
}

// src/services/VehiclesService.ts
class VehiclesService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/assets/vehicles", Vehicle.hydrate);
  }
}

// src/models/Equipment.ts
class Equipment {
  id = "";
  type = "equipment-items";
  attributes;
  meta = {};
  links = {};
  relationships;
  constructor() {
    this.attributes = {
      serial: ""
    };
  }
  static hydrate(data) {
    let equipment = new Equipment;
    if (data) {
      equipment.id = data.id || "";
      equipment.type = data.type || "equipment-items";
      equipment.relationships = data.relationships || {};
      equipment.attributes.serial = data.attributes.serial || "";
      equipment.meta = data.meta || {};
      equipment.links = data.links || {};
    }
    return equipment;
  }
}

// src/services/EquipmentService.ts
class EquipmentService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/assets/equipment", Equipment.hydrate);
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
    if (config.clientId && config.clientSecret && config.authDomain) {
      this.tokenPromise = this.getToken();
    }
  }
  async getToken() {
    const url = this.config.authDomain || "";
    const params = new URLSearchParams;
    params.append("grant_type", "client_credentials");
    params.append("client_id", this.config.clientId || "");
    params.append("client_secret", this.config.clientSecret || "");
    const response = await fetch(url + "/oauth2/token", {
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
  groups() {
    return new GroupsService(this);
  }
  vehicles() {
    return new VehiclesService(this);
  }
  equipment() {
    return new EquipmentService(this);
  }
  setOrganisationSlug(organisation) {
    this.config.organisationId = organisation;
  }
  finalEndpoint(url) {
    return `${this.config.baseDomain}${url.replace(":orgId", this.config.organisationId.toString())}`;
  }
  async makeDeleteRequest(endpoint) {
    await this.ensureAuthenticated();
    let url = Requests.buildRequestURL(endpoint);
    let headers = {
      "Content-Type": "application/json"
    };
    if (this.bearerToken) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    }
    try {
      const fetchResponse = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include"
      });
      let json = await fetchResponse.json();
      return Requests.buildInternalResponse(fetchResponse, json);
    } catch (error) {
      return Requests.buildInternalErrorResponse(error);
    }
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
  authDomain;
  constructor(config) {
    this.organisationId = config.organisationId;
    this.baseDomain = config.baseDomain || "https://app.ctrl-hub.com";
    this.clientId = config.clientId || "";
    this.clientSecret = config.clientSecret || "";
    this.authDomain = config.authDomain || "https://auth.ctrl-hub.com";
  }
}
export {
  Vehicle,
  ServiceAccountKey,
  ServiceAccount,
  RequestOptions,
  Permission,
  Log,
  Group,
  ClientConfig,
  Client
};
