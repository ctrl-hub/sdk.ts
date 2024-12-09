var __legacyDecorateClassTS = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1;i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

// src/utils/RequestOptions.ts
class RequestOptions {
  sort;
  limit;
  offset;
  filters;
  include;
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

// src/utils/ModelRegistry.ts
function RegisterModel(target) {
  return ModelRegistry.register(target);
}

class ModelRegistry {
  static instance;
  models = {};
  static getInstance() {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry;
    }
    return ModelRegistry.instance;
  }
  static register(modelClass) {
    const instance = new modelClass;
    if (instance.type) {
      ModelRegistry.getInstance().models[instance.type] = modelClass;
    }
    return modelClass;
  }
}

// src/utils/Hydrator.ts
class Hydrator {
  modelRegistry;
  constructor(modelRegistry) {
    this.modelRegistry = modelRegistry;
  }
  hydrateResponse(data, included) {
    return Array.isArray(data) ? this.hydrateArray(data, included) : this.hydrateSingle(data, included);
  }
  hydrateArray(items, included) {
    return items.map((item) => this.hydrateSingle(item, included));
  }
  hydrateSingle(item, included) {
    const ModelClass = this.modelRegistry.models[item.type];
    if (!ModelClass) {
      throw new Error(`No model found for type: ${item.type}`);
    }
    const hydratedItem = ModelClass.hydrate(item);
    return this.hydrateRelationships(hydratedItem, included);
  }
  hydrateRelationships(item, included) {
    if (!item.relationships || !included)
      return item;
    Object.entries(item.relationships).forEach(([_, relationship]) => {
      const { data } = relationship;
      if (!data)
        return;
      const hydrateRelation = (relation) => {
        const includedData = this.findMatchingIncluded(relation, included);
        if (!includedData) {
          return relation;
        }
        try {
          const ModelClass = this.modelRegistry.models[relation.type];
          return ModelClass ? ModelClass.hydrate(includedData) : includedData;
        } catch (e) {
          return includedData;
        }
      };
      relationship.data = Array.isArray(data) ? data.map(hydrateRelation) : hydrateRelation(data);
    });
    return item;
  }
  findMatchingIncluded(relation, included) {
    return included?.find((inc) => inc.id === relation.id && inc.type === relation.type);
  }
}

// src/utils/RequestBuilder.ts
class RequestBuilder {
  requestOptions = {};
  withIncludes(includes) {
    this.requestOptions.include = includes;
    return this;
  }
  withSort(sort) {
    this.requestOptions.sort = sort.map((sortOption) => ({
      key: sortOption.key,
      direction: sortOption.direction || "asc"
    }));
    return this;
  }
  withFilters(filters) {
    this.requestOptions.filters = filters;
    return this;
  }
  withPagination(limit, offset = 0) {
    this.requestOptions.limit = limit;
    this.requestOptions.offset = offset;
    return this;
  }
  withLimit(limit) {
    this.requestOptions.limit = limit;
    return this;
  }
  withOffset(offset) {
    this.requestOptions.offset = offset;
    return this;
  }
  buildRequestParams(endpoint, param, options) {
    let finalEndpoint = endpoint;
    let requestOptions;
    if (typeof param === "string") {
      finalEndpoint = `${endpoint}/${param}`;
      requestOptions = new RequestOptions({
        ...this.requestOptions,
        ...options
      });
    } else if (typeof param === "object" && param !== null) {
      requestOptions = new RequestOptions({
        ...this.requestOptions,
        ...param
      });
    } else if (Object.keys(this.requestOptions).length > 0) {
      requestOptions = new RequestOptions(this.requestOptions);
    }
    return { endpoint: finalEndpoint, requestOptions };
  }
  clearRequestOptions() {
    this.requestOptions = {};
  }
  getRequestOptions() {
    return this.requestOptions;
  }
}

// src/services/BaseService.ts
class BaseService extends RequestBuilder {
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
    resp.data = this.hydrator.hydrateResponse(resp.data, resp.included || []);
    this.clearRequestOptions();
    return resp;
  }
  async create(model) {
    return await this.client.makePostRequest(this.endpoint, {
      data: {
        type: model.type,
        attributes: model.attributes,
        relationships: model.relationships
      }
    });
  }
}

// src/services/FormCategoriesService.ts
class FormCategoriesService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/data-capture/form-categories");
  }
}

// src/services/RolesService.ts
class RolesService extends BaseService {
  constructor(client) {
    super(client, "/v3/iam/roles");
  }
}

// src/services/PermissionsService.ts
class PermissionsService extends BaseService {
  constructor(client) {
    super(client, "/v3/iam/permissions");
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
SubmissionVersion = __legacyDecorateClassTS([
  RegisterModel
], SubmissionVersion);

// src/services/SubmissionsService.ts
class SubmissionsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/data-capture/submissions");
  }
  async getVersions(submissionId) {
    const versionsEndpoint = `${this.endpoint}/${submissionId}/relationships/versions`;
    const resp = await this.client.makeGetRequest(versionsEndpoint);
    resp.data = resp.data.map((submissionVersion) => SubmissionVersion.hydrate(submissionVersion));
    return resp;
  }
  async getVersion(submissionId, versionId) {
    const versionEndpoint = `${this.endpoint}/${submissionId}/relationships/versions/${versionId}`;
    const resp = await this.client.makeGetRequest(versionEndpoint);
    resp.data = SubmissionVersion.hydrate(resp.data);
    return resp;
  }
}

// src/services/FormsService.ts
class FormsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/data-capture/forms");
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
  static hydrate(data) {
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
Log = __legacyDecorateClassTS([
  RegisterModel
], Log);

// src/services/ServiceAccountService.ts
class ServiceAccountsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/iam/service-accounts");
  }
  async createKey(serviceAccount) {
    let createKeyEndpoint = this.endpoint + "/" + serviceAccount.id + "/keys";
    return await this.client.makePostRequest(createKeyEndpoint, {
      data: {
        type: "service-account-keys"
      }
    });
  }
  async logs(id) {
    const logsEndpoint = `${this.endpoint}/${id}/logs`;
    const resp = await this.client.makeGetRequest(logsEndpoint);
    resp.data = resp.data.map((log) => Log.hydrate(log));
    return resp;
  }
}

// src/services/ServiceAccountKeysService.ts
class ServiceAccountKeysService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/iam/service-accounts");
  }
}

// src/services/GroupService.ts
class GroupsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/iam/groups");
  }
  async deleteBinding(groupId, bindingId) {
    let deleteEndpoint = this.endpoint + "/" + groupId + "/bindings/" + bindingId;
    return await this.client.makeDeleteRequest(deleteEndpoint);
  }
  async createBinding(groupId, body) {
    let createBindingEndpoint = this.endpoint + "/" + groupId + "/bindings";
    return await this.client.makePostRequest(createBindingEndpoint, {
      data: {
        type: "bindings",
        attributes: JSON.parse(body)
      }
    });
  }
}

// src/services/VehiclesService.ts
class VehiclesService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/assets/vehicles");
  }
}

// src/services/EquipmentService.ts
class EquipmentService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/assets/equipment");
  }
}

// src/models/VehicleModel.ts
class VehicleModel {
  id = "";
  type = "vehicle-models";
  attributes;
  meta = {};
  links = {};
  relationships;
  included;
  constructor(data) {
    this.id = data?.id ?? "";
    this.attributes = {
      name: data?.attributes?.name ?? ""
    };
    this.meta = data?.meta ?? {};
    this.links = data?.links ?? {};
    this.relationships = data?.relationships ?? {};
    this.included = data?.included ?? {};
  }
  static hydrate(data) {
    return new VehicleModel(data);
  }
}
VehicleModel = __legacyDecorateClassTS([
  RegisterModel
], VehicleModel);

// src/services/VehicleManufacturersService.ts
class VehicleManufacturersService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/vehicles/manufacturers");
  }
  async models(id) {
    const modelsEndpoint = `${this.endpoint}/${id}/models`;
    const resp = await this.client.makeGetRequest(modelsEndpoint);
    resp.data = resp.data.map((model) => VehicleModel.hydrate(model));
    return resp;
  }
}

// src/models/VehicleSpecification.ts
class VehicleSpecification {
  id = "";
  type = "vehicle-specifications";
  attributes;
  meta = {};
  links = {};
  relationships;
  included;
  constructor(data) {
    this.id = data?.id ?? "";
    this.attributes = {
      emissions: data?.attributes?.emissions ?? 0,
      engine: data?.attributes?.engine ?? "",
      fuel: data?.attributes?.fuel ?? "",
      transmission: data?.attributes?.transmission ?? "",
      year: data?.attributes?.year ?? 0,
      documentation: data?.attributes?.documentation ?? []
    };
    this.meta = data?.meta ?? {};
    this.links = data?.links ?? {};
    this.relationships = data?.relationships ?? {};
    this.included = data?.included ?? {};
  }
  static hydrate(data) {
    return new VehicleSpecification(data);
  }
}
VehicleSpecification = __legacyDecorateClassTS([
  RegisterModel
], VehicleSpecification);

// src/services/VehicleModelsService.ts
class VehicleModelsService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/vehicles/models");
  }
  async specifications(id) {
    const modelsEndpoint = `${this.endpoint}/${id}/specifications`;
    const resp = await this.client.makeGetRequest(modelsEndpoint);
    resp.data = resp.data.map((model) => VehicleSpecification.hydrate(model));
    return resp;
  }
}

// src/models/EquipmentModel.ts
class EquipmentModel {
  id = "";
  type = "equipment-models";
  attributes;
  meta = {};
  links = {};
  relationships;
  included;
  constructor(data) {
    this.id = data?.id ?? "";
    this.attributes = {
      name: data?.attributes?.name ?? "",
      documentation: data?.attributes?.documentation ?? []
    };
    this.meta = data?.meta ?? {};
    this.links = data?.links ?? {};
    this.relationships = data?.relationships ?? {};
    this.included = data?.included ?? {};
  }
  static hydrate(data) {
    return new EquipmentModel(data);
  }
}
EquipmentModel = __legacyDecorateClassTS([
  RegisterModel
], EquipmentModel);

// src/services/EquipmentManufacturersService.ts
class EquipmentManufacturersService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/equipment/manufacturers");
  }
  async models(id) {
    const modelsEndpoint = `${this.endpoint}/${id}/models`;
    const resp = await this.client.makeGetRequest(modelsEndpoint);
    resp.data = resp.data.map((model) => EquipmentModel.hydrate(model));
    return resp;
  }
}

// src/services/EquipmentModelsService.ts
class EquipmentModelsService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/equipment/models");
  }
}

// src/Client.ts
class Client {
  config;
  organisation;
  services = {};
  bearerToken = "";
  tokenPromise = null;
  constructor(config) {
    this.config = config;
    this.organisation = "";
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
  vehicleManufacturers() {
    return new VehicleManufacturersService(this);
  }
  vehicleModels() {
    return new VehicleModelsService(this);
  }
  equipment() {
    return new EquipmentService(this);
  }
  equipmentManufacturers() {
    return new EquipmentManufacturersService(this);
  }
  equipmentModels() {
    return new EquipmentModelsService(this);
  }
  setOrganisationSlug(organisation) {
    this.config.organisationId = organisation;
  }
  substituteOrganisation(url) {
    return `${this.config.baseDomain}${url.replace(":orgId", this.config.organisationId.toString())}`;
  }
  async makeDeleteRequest(endpoint) {
    await this.ensureAuthenticated();
    let url = Requests.buildRequestURL(endpoint);
    url = this.substituteOrganisation(url);
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
    url = this.substituteOrganisation(url);
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
    url = this.substituteOrganisation(url);
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
// src/models/Equipment.ts
class Equipment {
  id = "";
  type = "equipment-items";
  attributes;
  meta = {};
  links = {};
  relationships;
  included;
  constructor(data) {
    this.id = data?.id ?? "";
    this.attributes = {
      serial: data?.attributes?.serial ?? ""
    };
    this.meta = data?.meta ?? {};
    this.links = data?.links ?? {};
    this.relationships = {
      manufacturer: {
        data: {
          id: data?.relationships?.manufacturer?.data?.id ?? "",
          type: data?.relationships?.manufacturer?.data?.type ?? ""
        }
      },
      model: {
        data: {
          id: data?.relationships?.model?.data?.id ?? "",
          type: data?.relationships?.model?.data?.type ?? ""
        }
      }
    };
    this.included = data?.included ?? {};
  }
  static hydrate(data) {
    return new Equipment(data);
  }
}
Equipment = __legacyDecorateClassTS([
  RegisterModel
], Equipment);
// src/models/EquipmentManufacturer.ts
class EquipmentManufacturer {
  id = "";
  type = "equipment-manufacturers";
  attributes;
  meta = {};
  links = {};
  relationships;
  included;
  constructor(data) {
    this.id = data?.id ?? "";
    this.attributes = {
      name: data?.attributes?.name ?? ""
    };
    this.meta = data?.meta ?? {};
    this.links = data?.links ?? {};
    this.relationships = data?.relationships ?? {};
    this.included = data?.included ?? {};
  }
  static hydrate(data) {
    return new EquipmentManufacturer(data);
  }
}
EquipmentManufacturer = __legacyDecorateClassTS([
  RegisterModel
], EquipmentManufacturer);
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
Form = __legacyDecorateClassTS([
  RegisterModel
], Form);
// src/models/FormCategory.ts
class FormCategory {
  id = "";
  type = "form_categories";
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
FormCategory = __legacyDecorateClassTS([
  RegisterModel
], FormCategory);
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
Group = __legacyDecorateClassTS([
  RegisterModel
], Group);
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
Permission = __legacyDecorateClassTS([
  RegisterModel
], Permission);
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
Role = __legacyDecorateClassTS([
  RegisterModel
], Role);
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
  static hydrate(data) {
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
ServiceAccount = __legacyDecorateClassTS([
  RegisterModel
], ServiceAccount);
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
  static hydrate(data) {
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
ServiceAccountKey = __legacyDecorateClassTS([
  RegisterModel
], ServiceAccountKey);
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
Submission = __legacyDecorateClassTS([
  RegisterModel
], Submission);
// src/models/Vehicle.ts
class Vehicle {
  id = "";
  type = "vehicles";
  attributes;
  meta = {};
  links = {};
  relationships;
  included;
  constructor(data) {
    this.id = data?.id ?? "";
    this.attributes = {
      registration: data?.attributes?.registration ?? "",
      vin: data?.attributes?.vin ?? "",
      description: data?.attributes?.description ?? "",
      colour: data?.attributes?.colour ?? ""
    };
    this.meta = data?.meta ?? {};
    this.links = data?.links ?? {};
    this.relationships = {
      manufacturer: {
        data: {
          id: data?.relationships?.manufacturer?.data?.id ?? "",
          type: data?.relationships?.manufacturer?.data?.type ?? ""
        }
      },
      model: {
        data: {
          id: data?.relationships?.model?.data?.id ?? "",
          type: data?.relationships?.model?.data?.type ?? ""
        }
      },
      specification: {
        data: {
          id: data?.relationships?.specification?.data?.id ?? "",
          type: data?.relationships?.specification?.data?.type ?? ""
        }
      }
    };
    this.included = data?.included ?? {};
  }
  static hydrate(data) {
    return new Vehicle(data);
  }
}
Vehicle = __legacyDecorateClassTS([
  RegisterModel
], Vehicle);
// src/models/VehicleManufacturer.ts
class VehicleManufacturer {
  id = "";
  type = "vehicle-manufacturers";
  attributes;
  meta = {};
  links = {};
  relationships;
  included;
  constructor(data) {
    this.id = data?.id ?? "";
    this.attributes = {
      name: data?.attributes?.name ?? ""
    };
    this.meta = data?.meta ?? {};
    this.links = data?.links ?? {};
    this.relationships = data?.relationships ?? {};
    this.included = data?.included ?? {};
  }
  static hydrate(data) {
    return new VehicleManufacturer(data);
  }
}
VehicleManufacturer = __legacyDecorateClassTS([
  RegisterModel
], VehicleManufacturer);
export {
  VehicleModel,
  VehicleManufacturer,
  Vehicle,
  SubmissionVersion,
  Submission,
  ServiceAccountKey,
  ServiceAccount,
  Role,
  RequestOptions,
  Permission,
  Log,
  Group,
  FormCategory,
  Form,
  EquipmentModel,
  EquipmentManufacturer,
  Equipment,
  ClientConfig,
  Client
};
