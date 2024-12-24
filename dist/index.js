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

// src/models/BaseModel.ts
class BaseModel {
  id = "";
  type = "";
  meta;
  links;
  included;
  _relationships;
  static relationships = [];
  constructor(data) {
    this.id = data?.id ?? "";
    this.type = data?.type ?? "";
    if (data?.meta && Object.keys(data.meta).length > 0) {
      this.meta = data.meta;
    }
    if (data?.links && Object.keys(data.links).length > 0) {
      this.links = data.links;
    }
    if (data?.included && Object.keys(data.included).length > 0) {
      this.included = data.included;
    }
    if (data?.relationships && Object.keys(data.relationships).length > 0) {
      this._relationships = data.relationships;
    }
  }
  toJSON() {
    const obj = {};
    if (this.id)
      obj.id = this.id;
    if (this.type)
      obj.type = this.type;
    if (this.meta)
      obj.meta = this.meta;
    if (this.links)
      obj.links = this.links;
    for (const [key, value] of Object.entries(this)) {
      if (["id", "type", "meta", "links", "included", "_relationships"].includes(key)) {
        continue;
      }
      if (value !== null && value !== undefined) {
        if (typeof value === "object" && Object.keys(value).length === 0) {
          continue;
        }
        obj[key] = value;
      }
    }
    return obj;
  }
}

// src/models/Equipment.ts
class Equipment extends BaseModel {
  type = "equipment-items";
  serial = "";
  model = "";
  jsonApiMapping() {
    return {
      attributes: ["serial"],
      relationships: {
        model: "equipment-models"
      }
    };
  }
  static relationships = [
    {
      name: "model",
      type: "single",
      modelType: "equipment-models"
    }
  ];
  constructor(data) {
    super(data);
    this.serial = data?.attributes?.serial ?? data?.serial ?? "";
    this.model = data?.relationships?.model?.id ?? data?.model ?? "";
  }
}

// src/models/EquipmentCategory.ts
class EquipmentCategory extends BaseModel {
  type = "equipment-categories";
  name = "";
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
  }
}

// src/models/EquipmentModel.ts
class EquipmentModel extends BaseModel {
  type = "equipment-models";
  name = "";
  documentation = [];
  manufacturer;
  static relationships = [
    {
      name: "manufacturer",
      type: "single",
      modelType: "equipment-manufacturers"
    }
  ];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
    this.documentation = data?.attributes?.documentation ?? [];
  }
}

// src/models/Form.ts
class Form extends BaseModel {
  type = "forms";
  name = "";
  description = "";
  fieldMappings = [];
  status = "";
  formType = "";
  static relationships = [];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
    this.description = data?.attributes?.description ?? "";
    this.fieldMappings = data?.attributes?.field_mappings ?? [];
    this.status = data?.attributes?.status ?? "";
    this.formType = data?.attributes?.type ?? "";
  }
}

// src/models/FormCategory.ts
class FormCategory extends BaseModel {
  type = "form-categories";
  name = "";
  static relationships = [];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
  }
}

// src/models/Group.ts
class Group extends BaseModel {
  type = "groups";
  name = "";
  description = "";
  bindings = [];
  static relationships = [];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
    this.description = data?.attributes?.description ?? "";
    this.bindings = data?.attributes?.bindings ?? [];
  }
}

// src/models/Permission.ts
class Permission extends BaseModel {
  type = "permissions";
  description = "";
  static relationships = [];
  constructor(data) {
    super(data);
    this.description = data?.attributes?.description ?? "";
  }
}

// src/models/Role.ts
class Role extends BaseModel {
  type = "roles";
  custom = false;
  name = "";
  description = "";
  launch_stage = "";
  permissions = [];
  static relationships = [];
  constructor(data) {
    super(data);
    this.custom = data?.attributes?.custom ?? false;
    this.name = data?.attributes?.name ?? "";
    this.description = data?.attributes?.description ?? "";
    this.launch_stage = data?.attributes?.launch_stage ?? "";
    this.permissions = data?.attributes?.permissions ?? [];
  }
}

// src/models/ServiceAccount.ts
class ServiceAccount extends BaseModel {
  type = "service-accounts";
  name = "";
  description = "";
  email = "";
  enabled = false;
  keys = [];
  jsonApiMapping() {
    return {
      attributes: ["name", "description"]
    };
  }
  static relationships = [
    {
      name: "keys",
      type: "array",
      modelType: "service-account-keys"
    }
  ];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
    this.description = data?.attributes?.description ?? "";
    this.email = data?.attributes?.email ?? "";
    this.enabled = data?.attributes?.enabled ?? false;
  }
}

// src/models/ServiceAccountKey.ts
class ServiceAccountKey extends BaseModel {
  type = "service-account-keys";
  client_id = "";
  enabled = false;
  static relationships = [];
  constructor(data) {
    super(data);
    this.id = data?.id ?? "";
    this.client_id = data?.attributes?.client_id ?? "";
    this.enabled = data?.attributes?.enabled ?? false;
  }
}

// src/models/Submission.ts
class Submission extends BaseModel {
  type = "submissions";
  reference = "";
  status = "";
  static relationships = [
    {
      name: "form",
      type: "single",
      modelType: "forms"
    },
    {
      name: "form_version",
      type: "single",
      modelType: "form-versions"
    }
  ];
  constructor(data) {
    super(data);
    this.reference = data?.attributes?.reference ?? "";
    this.status = data?.attributes?.status ?? "";
  }
}

// src/models/Vehicle.ts
class Vehicle extends BaseModel {
  type = "vehicles";
  registration = "";
  vin = "";
  description = "";
  colour = "";
  specification = "";
  jsonApiMapping() {
    return {
      attributes: ["registration", "vin", "description", "colour"],
      relationships: {
        specification: "vehicle-specifications"
      }
    };
  }
  static relationships = [
    {
      name: "specification",
      type: "single",
      modelType: "vehicle-specifications"
    }
  ];
  constructor(data) {
    super(data);
    this.registration = data?.attributes?.registration ?? data?.registration ?? "";
    this.vin = data?.attributes?.vin ?? data?.vin ?? "";
    this.description = data?.attributes?.description ?? data?.description ?? "";
    this.colour = data?.attributes?.colour ?? data?.colour ?? "";
    this.specification = data?.relationships?.specification?.id ?? data?.specification ?? "";
  }
}

// src/models/VehicleCategory.ts
class VehicleCategory extends BaseModel {
  type = "vehicle-categories";
  name = "";
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
  }
}

// src/models/VehicleModel.ts
class VehicleModel extends BaseModel {
  type = "vehicle-models";
  name = "";
  static relationships = [
    {
      name: "manufacturer",
      type: "single",
      modelType: "vehicle-manufacturers"
    }
  ];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
  }
}

// src/models/VehicleManufacturer.ts
class VehicleManufacturer extends BaseModel {
  type = "vehicle-manufacturers";
  name = "";
  static relationships = [];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
  }
}

// src/models/VehicleSpecification.ts
class VehicleSpecification extends BaseModel {
  type = "vehicle-specifications";
  emissions = 0;
  engine = "";
  fuel = "";
  transmission = "";
  year = 0;
  documentation = [];
  model;
  static relationships = [
    {
      name: "model",
      type: "single",
      modelType: "vehicle-models"
    }
  ];
  constructor(data) {
    super(data);
    this.emissions = data?.attributes?.emissions ?? 0;
    this.engine = data?.attributes?.engine ?? "";
    this.fuel = data?.attributes?.fuel ?? "";
    this.transmission = data?.attributes?.transmission ?? "";
    this.year = data?.attributes?.year ?? 0;
    this.documentation = data?.attributes?.documentation ?? [];
    this.model = new VehicleModel;
  }
}

// src/models/EquipmentManufacturer.ts
class EquipmentManufacturer extends BaseModel {
  type = "equipment-manufacturers";
  name = "";
  static relationships = [];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
  }
}

// src/models/Property.ts
class Property extends BaseModel {
  type = "properties";
  custom = false;
  name = "";
  description = "";
  launch_stage = "";
  permissions = [];
  static relationships = [];
  constructor(data) {
    super(data);
    this.custom = data?.attributes?.custom ?? false;
    this.name = data?.attributes?.name ?? "";
    this.description = data?.attributes?.description ?? "";
    this.launch_stage = data?.attributes?.launch_stage ?? "";
    this.permissions = data?.attributes?.permissions ?? [];
  }
}

// src/utils/Hydrator.ts
class Hydrator {
  modelMap = {
    "equipment-categories": EquipmentCategory,
    "equipment-items": Equipment,
    "equipment-models": EquipmentModel,
    "equipment-manufacturers": EquipmentManufacturer,
    forms: Form,
    "form-categories": FormCategory,
    groups: Group,
    permissions: Permission,
    roles: Role,
    "service-accounts": ServiceAccount,
    "service-account-keys": ServiceAccountKey,
    submissions: Submission,
    vehicles: Vehicle,
    "vehicle-categories": VehicleCategory,
    "vehicle-models": VehicleModel,
    "vehicle-manufacturers": VehicleManufacturer,
    "vehicle-specifications": VehicleSpecification,
    properties: Property
  };
  getModelMap = () => {
    return this.modelMap;
  };
  hydrateResponse(data, included) {
    return Array.isArray(data) ? this.hydrateArray(data, included) : this.hydrateSingle(data, included);
  }
  hydrateArray(items, included) {
    return items.map((item) => this.hydrateSingle(item, included));
  }
  hydrateSingle(item, included) {
    const ModelClass = this.modelMap[item.type];
    if (!ModelClass) {
      throw new Error(`No model found for type: ${item.type}`);
    }
    const model = new ModelClass({
      id: item.id,
      type: item.type,
      meta: item.meta,
      links: item.links,
      attributes: item.attributes,
      relationships: item.relationships
    });
    if (item.relationships) {
      this.hydrateRelationships(model, item.relationships, included, ModelClass);
    }
    return model;
  }
  hydrateRelationships(model, relationships, included, ModelClass) {
    if (!("relationships" in ModelClass))
      return;
    const relationshipDefs = ModelClass.relationships;
    if (!relationshipDefs)
      return;
    for (const relationDef of relationshipDefs) {
      const relationData = relationships[relationDef.name]?.data;
      if (!relationData)
        continue;
      if (relationDef.type === "array") {
        model[relationDef.name] = Array.isArray(relationData) ? relationData.map((relation) => this.findAndHydrateIncluded(relation, included)) : [];
      } else {
        model[relationDef.name] = this.findAndHydrateIncluded(relationData, included);
      }
    }
  }
  findAndHydrateIncluded(relation, included) {
    const includedData = included.find((inc) => inc.id === relation.id && inc.type === relation.type);
    if (!includedData)
      return null;
    return this.hydrateSingle(includedData, included);
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

// src/utils/JsonSerializer.ts
class JsonApiSerializer {
  modelMap;
  constructor(modelMap) {
    this.modelMap = modelMap;
  }
  buildCreatePayload(model) {
    const ModelClass = this.modelMap[model.type];
    if (!ModelClass) {
      console.warn(`No model class found for type: ${model.type}`);
      return this.buildDefaultPayload(model);
    }
    const prototype = ModelClass.prototype;
    if (typeof prototype.jsonApiMapping === "function") {
      const mapping = prototype.jsonApiMapping.call(model);
      const payload = {
        data: {
          type: model.type,
          attributes: {},
          relationships: {}
        }
      };
      if (mapping.attributes) {
        mapping.attributes.forEach((attr) => {
          const value = model[attr];
          if (value !== undefined && value !== "") {
            payload.data.attributes[attr] = value;
          }
        });
      }
      if (mapping.relationships) {
        Object.entries(mapping.relationships).forEach(([key, relationshipType]) => {
          const relationshipValue = model[key];
          if (relationshipValue && typeof relationshipType === "string") {
            payload.data.relationships[key] = {
              data: {
                type: relationshipType,
                id: relationshipValue
              }
            };
          }
        });
      }
      return payload;
    }
    return this.buildDefaultPayload(model);
  }
  buildUpdatePayload(model) {
    const ModelClass = this.modelMap[model.type];
    if (!ModelClass) {
      console.warn(`No model class found for type: ${model.type}`);
      return this.buildDefaultPayload(model);
    }
    const prototype = ModelClass.prototype;
    if (typeof prototype.jsonApiMapping === "function") {
      const mapping = prototype.jsonApiMapping.call(model);
      const payload = {
        data: {
          id: model.id,
          type: model.type,
          attributes: {},
          relationships: {}
        }
      };
      if (mapping.attributes) {
        mapping.attributes.forEach((attr) => {
          const value = model[attr];
          if (value !== undefined && value !== "") {
            payload.data.attributes[attr] = value;
          }
        });
      }
      if (mapping.relationships) {
        Object.entries(mapping.relationships).forEach(([key, relationshipType]) => {
          const relationshipValue = model[key];
          if (relationshipValue && typeof relationshipType === "string") {
            payload.data.relationships[key] = {
              data: {
                type: relationshipType,
                id: relationshipValue.id
              }
            };
          }
        });
      }
      return payload;
    }
    return this.buildDefaultPayload(model);
  }
  buildDefaultPayload(model) {
    const { type, id, meta, links, included, _relationships, ...attributes } = model;
    return {
      data: {
        type: model.type,
        attributes
      }
    };
  }
}

// src/services/BaseService.ts
class BaseService extends RequestBuilder {
  client;
  endpoint;
  hydrator;
  constructor(client, endpoint) {
    super();
    this.client = client;
    this.endpoint = endpoint;
    this.hydrator = new Hydrator;
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
    const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
    const payload = jsonApiSerializer.buildCreatePayload(model);
    return await this.client.makePostRequest(this.endpoint, payload);
  }
  async update(id, model) {
    const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
    const payload = jsonApiSerializer.buildUpdatePayload(model);
    return await this.client.makePatchRequest(`${this.endpoint}/${id}`, payload);
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
class SubmissionVersion extends BaseModel {
  type = "submission-versions";
  author = "";
  form = "";
  form_version = "";
  reference = "";
  status = "";
  content = {};
  static relationships = [];
  constructor(data) {
    super(data);
    this.author = data?.attributes?.author ?? "";
    this.form = data?.attributes?.form ?? "";
    this.form_version = data?.attributes?.form_version ?? "";
    this.reference = data?.attributes?.reference ?? "";
    this.status = data?.attributes?.status ?? "";
    this.content = data?.attributes?.content ?? {};
  }
}

// src/services/SubmissionsService.ts
class SubmissionsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/data-capture/submissions");
  }
  async getVersions(submissionId) {
    const versionsEndpoint = `${this.endpoint}/${submissionId}/relationships/versions`;
    const resp = await this.client.makeGetRequest(versionsEndpoint);
    resp.data = resp.data.map((submissionVersion) => new SubmissionVersion(submissionVersion));
    return resp;
  }
  async getVersion(submissionId, versionId) {
    const versionEndpoint = `${this.endpoint}/${submissionId}/relationships/versions/${versionId}`;
    const resp = await this.client.makeGetRequest(versionEndpoint);
    resp.data = new SubmissionVersion(resp.data);
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
class Log extends BaseModel {
  type = "logs";
  actor;
  duration;
  request;
  response;
  static relationships = [];
  constructor(data) {
    super(data);
    this.actor = data?.attributes?.actor ?? { type: "", id: "" };
    this.duration = data?.attributes?.duration ?? 0;
    this.request = data?.attributes?.request ?? {
      time: "",
      headers: {},
      body: "",
      path: "",
      query: {},
      raw_query: "",
      method: "",
      content_length: 0
    };
    this.response = data?.attributes?.response ?? {
      time: "",
      body: "",
      headers: {},
      status: 0
    };
  }
}

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
    resp.data = resp.data.map((log) => new Log(log));
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

// src/services/VehicleManufacturersService.ts
class VehicleManufacturersService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/vehicles/manufacturers");
  }
  async models(manufacturerId) {
    const modelsEndpoint = `${this.endpoint}/${manufacturerId}/models`;
    const resp = await this.client.makeGetRequest(modelsEndpoint);
    resp.data = resp.data.map((model) => new VehicleModel(model));
    return resp;
  }
}

// src/services/VehicleModelsService.ts
class VehicleModelsService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/vehicles/manufacturers");
  }
  async specifications(manufacturerId, modelId) {
    const modelsEndpoint = `${this.endpoint}/${manufacturerId}/models/${modelId}/specifications`;
    const resp = await this.client.makeGetRequest(modelsEndpoint);
    resp.data = resp.data.map((model) => new VehicleSpecification(model));
    return resp;
  }
}

// src/services/VehicleCategoriesService.ts
class VehicleCategoriesService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/vehicles/categories");
  }
}

// src/services/EquipmentManufacturersService.ts
class EquipmentManufacturersService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/equipment/manufacturers");
  }
  async models(id) {
    const modelsEndpoint = `${this.endpoint}/${id}/models`;
    const resp = await this.client.makeGetRequest(modelsEndpoint);
    resp.data = resp.data.map((model) => new EquipmentModel(model));
    return resp;
  }
}

// src/services/EquipmentCategoriesService.ts
class EquipmentCategoriesService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/equipment/categories");
  }
}

// src/services/EquipmentModelsService.ts
class EquipmentModelsService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/equipment/models");
  }
}

// src/services/PropertiesService.ts
class PropertiesService extends BaseService {
  constructor(client) {
    super(client, "/v3/governance/properties");
  }
  async byUprn(uprn) {
    if (!Array.isArray(uprn)) {
      return await this.client.makeGetRequest(`${this.endpoint}/${uprn}`);
    }
    const filter = "?" + uprn.map((value) => `filter[uprn]=${encodeURIComponent(value)}`).join("&");
    return await this.client.makeGetRequest(`${this.endpoint}${filter}`);
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
  vehicleCategories() {
    return new VehicleCategoriesService(this);
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
  equipmentCategories() {
    return new EquipmentCategoriesService(this);
  }
  properties() {
    return new PropertiesService(this);
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
  async makePatchRequest(baseEndpoint, body, param) {
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
        method: "PATCH",
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
