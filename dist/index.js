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
    this.name = data?.attributes?.name ?? data?.name ?? "";
  }
  jsonApiMapping() {
    return {
      attributes: ["name"]
    };
  }
}

// src/models/EquipmentExposure.ts
class EquipmentExposure extends BaseModel {
  type = "equipment-exposures";
  start_time;
  end_time;
  location = {
    type: "Point",
    coordinates: [0, 0]
  };
  ppe = {
    mask: false,
    ear_defenders: false
  };
  jsonApiMapping() {
    return {
      attributes: ["end_time", "location", "ppe", "start_time"],
      relationships: {
        author: "author",
        equipment: "equipment"
      }
    };
  }
  static relationships = [
    {
      name: "author",
      type: "single",
      modelType: "users"
    },
    {
      name: "equipment",
      type: "single",
      modelType: "equipment"
    }
  ];
  constructor(data) {
    super(data);
    this.start_time = data?.attributes?.start_time?.id ?? data?.start_time ?? "";
    this.end_time = data?.attributes?.end_time ?? data?.end_time ?? "";
    if (data?.attributes?.location) {
      const locationData = data.attributes.location;
      this.location = {
        type: locationData.type ?? "",
        coordinates: locationData.coordinates ?? []
      };
    }
    if (data?.location) {
      const locationData = data.location;
      this.location = {
        type: locationData.type ?? "",
        coordinates: locationData.coordinates ?? []
      };
    }
    if (data?.attributes?.ppe) {
      const ppeData = data.attributes?.ppe;
      this.ppe = {
        mask: ppeData.ppe?.mask ?? false,
        ear_defenders: ppeData.ppe?.ear_defenders ?? false
      };
    }
    if (data?.ppe) {
      const ppeData = data.ppe;
      this.ppe = {
        mask: ppeData.mask ?? false,
        ear_defenders: ppeData.ear_defenders ?? false
      };
    }
  }
}

// src/models/EquipmentModel.ts
class EquipmentModel extends BaseModel {
  type = "equipment-models";
  name = "";
  description = "";
  specification;
  categories = [];
  documentation = [];
  manufacturer;
  static relationships = [
    {
      name: "manufacturer",
      type: "single",
      modelType: "equipment-manufacturers"
    },
    {
      name: "categories",
      type: "array",
      modelType: "equipment-categories"
    }
  ];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
    this.description = data?.attributes?.description ?? "";
    this.documentation = data?.attributes?.documentation ?? [];
    this.categories = [];
    this.specification = data?.attributes?.specification ?? {};
    const categoryData = data?.relationships?.categories?.data ?? [];
    this.categories = categoryData.map((category) => ({
      id: category.id,
      name: this.included?.find((inc) => inc.type === "equipment-categories" && inc.id === category.id)?.attributes?.name || ""
    }));
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
    this.name = data?.attributes?.name ?? data?.name ?? "";
    this.description = data?.attributes?.description ?? data?.description ?? "";
    this.bindings = data?.attributes?.bindings ?? [];
  }
  jsonApiMapping() {
    return {
      attributes: ["name", "description"],
      relationships: {}
    };
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

// src/models/ServiceAccountKey.ts
class ServiceAccountKey extends BaseModel {
  type = "service-account-keys";
  client_id = "";
  enabled = false;
  created_at;
  static relationships = [];
  constructor(data) {
    super(data);
    this.id = data?.id ?? "";
    this.enabled = data?.attributes?.enabled ?? data?.enabled ?? false;
    let raw_created_at = data?.attributes?.created_at ?? data?.created_at ?? null;
    if (raw_created_at) {
      this.created_at = new Date(raw_created_at);
    }
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
  static relationships = [];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
    this.description = data?.attributes?.description ?? "";
    this.email = data?.attributes?.email ?? "";
    this.enabled = data?.attributes?.enabled ?? false;
    if (data?.attributes?.keys) {
      this.keys = data.attributes.keys.map((key) => new ServiceAccountKey(key));
    }
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
  status = "";
  jsonApiMapping() {
    return {
      attributes: ["registration", "vin", "description", "colour", "status"],
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
    },
    {
      name: "assignee",
      type: "single",
      modelType: "users"
    },
    {
      name: "equipment",
      type: "array",
      modelType: "equipment"
    }
  ];
  constructor(data) {
    super(data);
    this.registration = data?.attributes?.registration ?? data?.registration ?? "";
    this.vin = data?.attributes?.vin ?? data?.vin ?? "";
    this.description = data?.attributes?.description ?? data?.description ?? "";
    this.colour = data?.attributes?.colour ?? data?.colour ?? "";
    this.specification = data?.relationships?.specification?.id ?? data?.specification ?? "";
    this.status = data?.attributes?.status ?? data?.status ?? "";
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
  jsonApiMapping() {
    return {
      attributes: ["name"]
    };
  }
}

// src/models/VehicleModel.ts
class VehicleModel extends BaseModel {
  type = "vehicle-models";
  name = "";
  categories = [];
  static relationships = [
    {
      name: "manufacturer",
      type: "single",
      modelType: "vehicle-manufacturers"
    },
    {
      name: "categories",
      type: "array",
      modelType: "vehicle-categories"
    }
  ];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
    this.categories = [];
    const categoryData = data?.relationships?.categories?.data ?? [];
    this.categories = categoryData.map((category) => ({
      id: category.id,
      name: this.included?.find((inc) => inc.type === "vehicle-categories" && inc.id === category.id)?.attributes?.name || ""
    }));
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
  jsonApiMapping() {
    return {
      attributes: ["name"]
    };
  }
}

// src/models/VehicleSpecification.ts
class VehicleSpecification extends BaseModel {
  type = "vehicle-specifications";
  emissions = 0;
  engine_capacity = "";
  fuel_type = "";
  year = 0;
  wheelplan = "";
  documentation = [];
  jsonApiMapping() {
    return {
      attributes: ["emissions", "engine_capacity", "fuel_type", "year", "wheelplan", "documentation"]
    };
  }
  static relationships = [
    {
      name: "model",
      type: "single",
      modelType: "vehicle-models"
    }
  ];
  constructor(data) {
    super(data);
    this.emissions = data?.attributes?.emissions ?? data?.emissions ?? 0;
    this.engine_capacity = data?.attributes?.engine_capacity ?? data?.engine_capacity ?? "";
    this.fuel_type = data?.attributes?.fuel_type ?? data?.fuel_type ?? "";
    this.year = data?.attributes?.year ?? data?.year ?? 0;
    this.wheelplan = data?.attributes?.wheelplan ?? data?.wheelplan ?? "";
    this.documentation = data?.attributes?.documentation ?? [];
  }
}

// src/models/EquipmentManufacturer.ts
class EquipmentManufacturer extends BaseModel {
  type = "equipment-manufacturers";
  name = "";
  static relationships = [];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? data?.name ?? "";
  }
  jsonApiMapping() {
    return {
      attributes: ["name"]
    };
  }
}

// src/models/Property.ts
class Property extends BaseModel {
  type = "properties";
  uprn = 0;
  location = { type: "", coordinates: [] };
  address = { description: "", department: "", organisation: "", number: "", name: "", thoroughfare: "", dependent_thoroughfare: "", post_town: "", postcode: "", pobox: "", country: "" };
  psr = { indicator: false, priority: 0, notes: "", contact: "" };
  pressure_tests = { source: "", id: "" };
  mprn = 0;
  mpan = 0;
  static relationships = [
    {
      name: "pressure_tests",
      type: "array",
      modelType: "pressure-tests"
    }
  ];
  constructor(data) {
    super(data);
    this.uprn = data?.attributes?.uprn ?? data?.uprn ?? 0;
    this.location = data?.attributes?.location ?? data?.location ?? { type: "", coordinates: [] };
    this.address = data?.attributes?.address ?? data?.address ?? { description: "", department: "", organisation: "", number: "", name: "", thoroughfare: "", dependent_thoroughfare: "", post_town: "", postcode: "", pobox: "", country: "" };
    this.psr = data?.attributes?.psr ?? data?.psr ?? { indicator: false, priority: 0, notes: "", contact: "" };
    this.pressure_tests = data?.attributes?.pressure_tests ?? data?.pressure_tests ?? { source: "", id: "" };
    this.mprn = data?.attributes?.mprn ?? data?.mprn ?? 0;
    this.mpan = data?.attributes?.mpan ?? data?.mpan ?? 0;
  }
}

// src/models/VehicleInventoryCheck.ts
class VehicleInventoryCheck extends BaseModel {
  type = "vehicle-inventory-checks";
  inspected_at = "";
  items = [];
  jsonApiMapping() {
    return {
      attributes: ["registration", "vin", "description", "colour"],
      relationships: {
        author: "author",
        vehicle: "vehicle"
      }
    };
  }
  static relationships = [
    {
      name: "equipment",
      type: "array",
      modelType: "equipment-items"
    },
    {
      name: "author",
      type: "single",
      modelType: "users"
    },
    {
      name: "vehicle",
      type: "single",
      modelType: "vehicles"
    }
  ];
  constructor(data) {
    super(data);
    this.inspected_at = data?.attributes?.inspected_at ?? data?.inspected_at ?? "";
    this.items = data?.attributes?.items ?? [];
  }
}

// src/models/VehicleInspection.ts
class VehicleInspection extends BaseModel {
  type = "vehicle-inspection";
  inspected_at = "";
  checks;
  jsonApiMapping() {
    return {
      attributes: [
        "visible_damage",
        "tyres",
        "washers_and_wipers",
        "windscreen",
        "number_plate",
        "security",
        "accessories",
        "spare_number_plate",
        "safe_access",
        "reversing_alarm",
        "beacons",
        "chemicals_and_fuel",
        "storage",
        "lights_and_indicators",
        "engine_warning_lights",
        "servicing",
        "levels",
        "cleanliness",
        "driver_checks"
      ],
      relationships: {
        author: "author",
        vehicle: "vehicle"
      }
    };
  }
  static relationships = [
    {
      name: "author",
      type: "single",
      modelType: "users"
    },
    {
      name: "vehicle",
      type: "single",
      modelType: "vehicles"
    }
  ];
  constructor(data) {
    super(data);
    this.inspected_at = data?.attributes?.inspected_at ?? data?.inspected_at ?? "";
    this.checks = data?.attributes?.checks ?? [];
  }
}

// src/models/User.ts
class User extends BaseModel {
  type = "users";
  email = "";
  identities = [];
  profile = {
    address: {
      area: "",
      country_code: "",
      county: "",
      name: "",
      number: "",
      postcode: "",
      street: "",
      town: "",
      what3words: ""
    },
    contact: {
      landline: "",
      mobile: ""
    },
    personal: {
      dob: "",
      first_name: "",
      last_name: "",
      username: ""
    },
    settings: {
      preferred_language: "",
      timezone: ""
    },
    work: {
      cscs: "",
      eusr: "",
      occupation: "",
      start_date: ""
    }
  };
  jsonApiMapping() {
    return {
      attributes: ["email", "identities", "profile"]
    };
  }
  static relationships = [];
  constructor(data) {
    super(data);
    this.email = data?.attributes?.email ?? "";
    this.identities = data?.attributes?.identities ?? [];
    if (data?.attributes?.profile) {
      const profileData = data.attributes.profile;
      this.profile = {
        address: {
          area: profileData.address?.area ?? "",
          country_code: profileData.address?.country_code ?? "",
          county: profileData.address?.county ?? "",
          name: profileData.address?.name ?? "",
          number: profileData.address?.number ?? "",
          postcode: profileData.address?.postcode ?? "",
          street: profileData.address?.street ?? "",
          town: profileData.address?.town ?? "",
          what3words: profileData.address?.what3words ?? ""
        },
        contact: {
          landline: profileData.contact?.landline ?? "",
          mobile: profileData.contact?.mobile ?? ""
        },
        personal: {
          dob: profileData.personal?.dob ?? "",
          first_name: profileData.personal?.first_name ?? "",
          last_name: profileData.personal?.last_name ?? "",
          username: profileData.personal?.username ?? ""
        },
        settings: {
          preferred_language: profileData.settings?.preferred_language ?? "",
          timezone: profileData.settings?.timezone ?? ""
        },
        work: {
          cscs: profileData.work?.cscs ?? "",
          eusr: profileData.work?.eusr ?? "",
          occupation: profileData.work?.occupation ?? "",
          start_date: profileData.work?.start_date ?? ""
        }
      };
    }
  }
  label = () => {
    if (this.profile.personal.first_name && this.profile.personal.last_name) {
      return this.profile.personal.first_name + " " + this.profile.personal.last_name;
    }
    return this.email;
  };
}

// src/models/MotRecord.ts
class MotRecord extends BaseModel {
  type = "vehicle-mot-records";
  completedDate = "";
  dataSource = "";
  defects = [];
  expiryDate = "";
  odometer = {
    type: "read",
    unit: "kilometers",
    value: 0
  };
  result = "";
  jsonApiMapping() {
    return {};
  }
  static relationships = [];
  constructor(data) {
    super(data);
    this.completedDate = data?.attributes.completed_date ?? data?.completedDate;
    this.dataSource = data?.attributes.data_source ?? data?.dateSource;
    this.defects = data?.attributes.defects ?? data?.defects;
    this.expiryDate = data?.attributes.expiry_date ?? data?.expiryDate;
    this.odometer = data?.attributes.odometer ?? data?.odometer;
    this.result = data?.attributes.result ?? data?.result;
  }
}

// src/models/FormVersion.ts
class FormVersion extends BaseModel {
  type = "form-version";
  name = "";
  static relationships = [];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? "";
  }
}

// src/models/Contact.ts
class Contact extends BaseModel {
  type = "contacts";
  salutation = "";
  first_name = "";
  last_name = "";
  telephone = "";
  email = "";
  jsonApiMapping() {
    return {
      attributes: ["salutation", "first_name", "last_name", "telephone", "email"]
    };
  }
  static relationships = [
    {
      name: "customer_accounts",
      type: "array",
      modelType: "customer-accounts"
    },
    {
      name: "representative",
      type: "array",
      modelType: "customer-interactions"
    },
    {
      name: "properties",
      type: "array",
      modelType: "properties"
    }
  ];
  constructor(data) {
    super(data);
    this.salutation = data?.attributes?.salutation ?? data?.salutation ?? "";
    this.first_name = data?.attributes?.first_name ?? data?.first_name ?? "";
    this.last_name = data?.attributes?.last_name ?? data?.last_name ?? "";
    this.telephone = data?.attributes?.telephone ?? data?.telephone ?? "";
    this.email = data?.attributes?.email ?? data?.email ?? "";
  }
}

// src/models/CustomerAccount.ts
class CustomerAccount extends BaseModel {
  type = "customer-accounts";
  static relationships = [
    {
      name: "properties",
      type: "array",
      modelType: "properties"
    },
    {
      name: "contacts",
      type: "array",
      modelType: "contacts"
    },
    {
      name: "interactions",
      type: "array",
      modelType: "customer-interactions"
    }
  ];
  constructor(data) {
    super(data);
  }
  jsonApiMapping() {
    return {
      relationships: ["contacts", "properties"]
    };
  }
}

// src/models/CustomerInteraction.ts
class CustomerInteraction extends BaseModel {
  type = "customer-interactions";
  method;
  direction;
  date_time = "";
  contacted = false;
  status = "";
  notes = "";
  representative;
  property;
  contact;
  customer_account;
  jsonApiMapping() {
    return {
      attributes: ["method", "direction", "date_time", "contacted", "status", "notes"],
      relationships: {
        representative: "users",
        property: "properties",
        contact: "contacts",
        customer_account: "customer-accounts"
      }
    };
  }
  static relationships = [
    {
      name: "representative",
      type: "single",
      modelType: "users"
    },
    {
      name: "property",
      type: "single",
      modelType: "properties"
    },
    {
      name: "contact",
      type: "single",
      modelType: "contacts"
    },
    {
      name: "customer_account",
      type: "single",
      modelType: "customer-accounts"
    }
  ];
  constructor(data) {
    super(data);
    this.method = data?.attributes?.method ?? data?.method ?? "";
    this.direction = data?.attributes?.direction ?? data?.direction ?? "";
    this.date_time = data?.attributes?.date_time ?? data?.date_time ?? "";
    this.contacted = data?.attributes?.contacted ?? data?.contacted ?? false;
    this.status = data?.attributes?.status ?? data?.status ?? "";
    this.notes = data?.attributes?.notes ?? data?.notes ?? "";
  }
}

// src/models/Team.ts
class Team extends BaseModel {
  type = "teams";
  name = "";
  jsonApiMapping() {
    return {
      attributes: ["name"],
      relationships: {
        members: "users"
      }
    };
  }
  static relationships = [
    {
      name: "members",
      type: "array",
      modelType: "users"
    }
  ];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? data?.name ?? "";
  }
}

// src/models/Scheme.ts
class Scheme extends BaseModel {
  type = "schemes";
  name = "";
  code = "";
  description = "";
  start_date = "";
  end_date = "";
  labels = [];
  static relationships = [
    {
      name: "work_orders",
      type: "array",
      modelType: "work-orders"
    }
  ];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? data?.name ?? "";
    this.code = data?.attributes?.code ?? data?.code ?? "";
    this.description = data?.attributes?.description ?? data?.description ?? "";
    this.start_date = data?.attributes?.start_date ?? data?.start_date ?? "";
    this.end_date = data?.attributes?.end_date ?? data?.end_date ?? "";
    this.labels = data?.attributes?.labels ?? data?.labels ?? [];
  }
  jsonApiMapping() {
    return {
      attributes: ["name", "code", "description", "start_date", "end_date", "labels"]
    };
  }
}

// src/models/WorkOrder.ts
class WorkOrder extends BaseModel {
  type = "work-orders";
  name = "";
  code = "";
  description = "";
  start_date = "";
  end_date = "";
  labels = [];
  static relationships = [
    {
      name: "operations",
      type: "array",
      modelType: "operations"
    }
  ];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? data?.name ?? "";
    this.code = data?.attributes?.code ?? data?.code ?? "";
    this.description = data?.attributes?.description ?? data?.description ?? "";
    this.start_date = data?.attributes?.start_date ?? data?.start_date ?? "";
    this.end_date = data?.attributes?.end_date ?? data?.end_date ?? "";
    this.labels = data?.attributes?.labels ?? data?.labels ?? [];
  }
  jsonApiMapping() {
    return {
      attributes: ["name", "code", "description", "start_date", "end_date", "labels"]
    };
  }
}

// src/models/Operation.ts
class Operation extends BaseModel {
  type = "operations";
  name = "";
  code = "";
  description = "";
  start_date = "";
  end_date = "";
  labels = [];
  uprns = [];
  usrns = [];
  completed = false;
  aborted = false;
  cancelled = false;
  static relationships = [
    {
      name: "properties",
      type: "array",
      modelType: "properties"
    },
    {
      name: "streets",
      type: "array",
      modelType: "streets"
    }
  ];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? data?.name ?? "";
    this.code = data?.attributes?.code ?? data?.code ?? "";
    this.description = data?.attributes?.description ?? data?.description ?? "";
    this.start_date = data?.attributes?.start_date ?? data?.start_date ?? "";
    this.end_date = data?.attributes?.end_date ?? data?.end_date ?? "";
    this.labels = data?.attributes?.labels ?? data?.labels ?? [];
    this.uprns = data?.attributes?.uprns ?? data?.uprns ?? [];
    this.usrns = data?.attributes?.usrns ?? data?.usrns ?? [];
    this.completed = data?.attributes?.completed ?? data?.completed ?? false;
    this.aborted = data?.attributes?.aborted ?? data?.aborted ?? false;
    this.cancelled = data?.attributes?.cancelled ?? data?.cancelled ?? false;
  }
  jsonApiMapping() {
    return {
      attributes: ["name", "code", "description", "start_date", "end_date", "labels", "uprns", "usrns", "completed", "aborted", "cancelled"]
    };
  }
}

// src/models/OperationTemplate.ts
class OperationTemplate extends BaseModel {
  type = "operation-templates";
  name = "";
  labels = [];
  static relationships = [];
  constructor(data) {
    super(data);
    this.name = data?.attributes?.name ?? data?.name ?? "";
    this.labels = data?.attributes?.labels ?? data?.labels ?? [];
  }
  jsonApiMapping() {
    return {
      attributes: ["name", "labels"]
    };
  }
}

// src/models/Street.ts
class Street extends BaseModel {
  type = "streets";
  usrn = 0;
  location = { type: "", coordinates: [] };
  static relationships = [];
  constructor(data) {
    super(data);
    this.usrn = data?.attributes?.usrn ?? data.usrn ?? 0;
    this.location = data?.attributes?.location ?? data.location ?? { type: "", coordinates: [] };
  }
}

// src/models/Appointment.ts
class Appointment extends BaseModel {
  type = "appointments";
  start_time = "";
  end_time = "";
  notes = "";
  jsonApiMapping() {
    return {
      attributes: ["start_time", "end_time", "notes"],
      relationships: {
        customer_interaction: "customer-interactions",
        operation: "operations"
      }
    };
  }
  static relationships = [
    {
      name: "customer_interaction",
      type: "single",
      modelType: "customer-interactions"
    },
    {
      name: "operation",
      type: "single",
      modelType: "operations"
    }
  ];
  constructor(data) {
    super(data);
    this.start_time = data?.attributes?.start_time ?? data?.start_time ?? "";
    this.end_time = data?.attributes?.end_time ?? data?.end_time ?? "";
    this.notes = data?.attributes?.notes ?? data?.notes ?? "";
  }
}

// src/utils/Hydrator.ts
class Hydrator {
  modelMap = {
    appointments: Appointment,
    contacts: Contact,
    "customer-accounts": CustomerAccount,
    "customer-interactions": CustomerInteraction,
    "equipment-categories": EquipmentCategory,
    "equipment-items": Equipment,
    "equipment-exposures": EquipmentExposure,
    "equipment-models": EquipmentModel,
    "equipment-manufacturers": EquipmentManufacturer,
    forms: Form,
    "form-categories": FormCategory,
    "form-versions": FormVersion,
    groups: Group,
    "operation-templates": OperationTemplate,
    operations: Operation,
    permissions: Permission,
    properties: Property,
    roles: Role,
    schemes: Scheme,
    "service-accounts": ServiceAccount,
    "service-account-keys": ServiceAccountKey,
    streets: Street,
    submissions: Submission,
    teams: Team,
    users: User,
    vehicles: Vehicle,
    "vehicle-categories": VehicleCategory,
    "vehicle-models": VehicleModel,
    "vehicle-manufacturers": VehicleManufacturer,
    "vehicle-specifications": VehicleSpecification,
    "vehicle-inventory-checks": VehicleInventoryCheck,
    "vehicle-inspections": VehicleInspection,
    "vehicle-mot-records": MotRecord,
    "work-orders": WorkOrder
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
      return relation;
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
    return this.buildPayload(model, false);
  }
  buildUpdatePayload(model) {
    return this.buildPayload(model, true);
  }
  buildPayload(model, isUpdate) {
    const ModelClass = this.modelMap[model.type];
    if (!ModelClass) {
      console.warn(`No model class found for type: ${model.type}`);
      return this.buildDefaultPayload(model, isUpdate);
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
      if (isUpdate && model.id) {
        payload.data.id = model.id;
      }
      prototype.constructor.relationships.forEach((relationship) => {
        if (relationship.type === "array") {
          const value = model[relationship.name];
          if (value) {
            payload.data.relationships[relationship.name] = {
              data: value.map((item) => ({
                type: relationship.modelType,
                id: item.id
              }))
            };
          }
        } else {
          const value = model[relationship.name];
          if (value) {
            payload.data.relationships[relationship.name] = {
              data: {
                type: relationship.modelType,
                id: typeof value === "string" ? value : value.id
              }
            };
          }
        }
      });
      if (mapping.attributes) {
        mapping.attributes.forEach((attr) => {
          const value = model[attr];
          if (value !== undefined && value !== "") {
            payload.data.attributes[attr] = value;
          }
        });
      }
      return payload;
    }
    return this.buildDefaultPayload(model, isUpdate);
  }
  buildRelationshipPayload(model, relationships) {
    const ModelClass = this.modelMap[model.type];
    if (!ModelClass) {
      console.warn(`No model class found for type: ${model.type}`);
      return { data: [] };
    }
    const data = relationships.filter((relationship) => relationship.id !== undefined).map((relationship) => ({
      type: model.type,
      id: relationship.id
    }));
    return { data };
  }
  buildDefaultPayload(model, includeId) {
    const { type, id, meta, links, included, _relationships, ...attributes } = model;
    const payload = {
      data: {
        type: model.type,
        attributes
      }
    };
    if (includeId && id) {
      payload.data.id = id;
    }
    return payload;
  }
}

// src/services/BaseService.ts
class BaseService extends RequestBuilder {
  client;
  endpoint;
  hydrator;
  jsonApiSerializer;
  constructor(client, endpoint) {
    super();
    this.client = client;
    this.endpoint = endpoint;
    this.hydrator = new Hydrator;
    this.jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
  }
  convertToJsonApi(model) {
    return this.jsonApiSerializer.buildCreatePayload(model);
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
  async create(model, params) {
    if (params) {
    }
    const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
    const payload = jsonApiSerializer.buildCreatePayload(model);
    return await this.client.makePostRequest(this.endpoint, payload);
  }
  async update(id, model, params) {
    if (params) {
    }
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
  async enquiry(registration) {
    const enquiryEndpoint = "/v3/assets/vehicles/enquiries";
    const body = {
      data: {
        type: "vehicle-enquiries",
        attributes: {
          registration
        }
      }
    };
    return await this.client.makePostRequest(enquiryEndpoint, body);
  }
  async motRecords(vehicleId) {
    const motRecordsEndpoint = `${this.endpoint}/${vehicleId}/mot-records`;
    const resp = await this.client.makeGetRequest(motRecordsEndpoint);
    const hydrator = new Hydrator;
    resp.data = hydrator.hydrateResponse(resp.data, resp.included);
    return resp;
  }
}

// src/services/EquipmentService.ts
class EquipmentService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/assets/equipment");
  }
}

// src/services/EquipmentExposureService.ts
class EquipmentExposureService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/assets/equipment/exposures");
  }
}

// src/services/VehicleManufacturersService.ts
class VehicleManufacturersService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/vehicles/manufacturers");
  }
  async models(manufacturerId) {
    const modelsEndpoint = `${this.endpoint}/${manufacturerId}/models?include=categories`;
    const resp = await this.client.makeGetRequest(modelsEndpoint);
    resp.data = resp.data.map((modelData) => {
      return new VehicleModel({
        ...modelData,
        included: resp.included
      });
    });
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
    const modelsEndpoint = `${this.endpoint}/${id}/models?include=categories`;
    const resp = await this.client.makeGetRequest(modelsEndpoint);
    resp.data = resp.data.map((modelData) => {
      return new EquipmentModel({
        ...modelData,
        included: resp.included
      });
    });
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

// src/services/VehicleModelSpecificationService.ts
class VehicleModelSpecificationService extends BaseService {
  constructor(client) {
    super(client, "/v3/assets/vehicles/manufacturers");
  }
  create(model, params) {
    const { manufacturerId, modelId } = params;
    const endpoint = this.endpoint + `/${manufacturerId}/models/${modelId}/specifications`;
    return this.client.makePostRequest(endpoint, this.convertToJsonApi(model));
  }
}

// src/services/ContactsService.ts
class ContactsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/contacts");
  }
}

// src/services/CustomerAccountsService.ts
class CustomerAccountsService extends BaseService {
  constructor(client, customerAccountId) {
    const endpoint = customerAccountId ? `/v3/orgs/:orgId/customer-accounts/${customerAccountId}` : `/v3/orgs/:orgId/customer-accounts`;
    super(client, endpoint);
  }
  async patchProperties(properties) {
    const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
    const payload = jsonApiSerializer.buildRelationshipPayload(new Property, properties);
    return await this.client.makePatchRequest(`${this.endpoint}/relationships/properties`, payload);
  }
  async patchContacts(contacts) {
    const jsonApiSerializer = new JsonApiSerializer(this.hydrator.getModelMap());
    const payload = jsonApiSerializer.buildRelationshipPayload(new Contact, contacts);
    return await this.client.makePatchRequest(`${this.endpoint}/relationships/contacts`, payload);
  }
}

// src/services/CustomerInteractionsService.ts
class CustomerInteractionsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/customer-interactions");
  }
}

// src/services/TeamsService.ts
class TeamsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/people/teams");
  }
}

// src/services/SchemesService.ts
class SchemesService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/governance/schemes");
  }
}

// src/services/WorkOrdersService.ts
class WorkOrdersService extends BaseService {
  constructor(client, schemeId) {
    super(client, `/v3/orgs/:orgId/governance/schemes/${schemeId}/work-orders`);
  }
}

// src/services/OperationsService.ts
class OperationsService extends BaseService {
  constructor(client, schemeId, workOrderId) {
    super(client, `/v3/orgs/:orgId/governance/schemes/${schemeId}/work-orders/${workOrderId}/operations`);
  }
}

// src/services/OperationTemplatesService.ts
class OperationTemplatesService extends BaseService {
  constructor(client) {
    super(client, `/v3/orgs/:orgId/governance/operation-templates`);
  }
}

// src/services/VehicleInspectionService.ts
class VehicleInspectionService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/assets/vehicles/inspections");
  }
}

// src/services/VehicleInventoryCheckService.ts
class VehicleInventoryCheckService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/assets/vehicles/inventory-checks");
  }
}

// src/services/AppointmentsService.ts
class AppointmentsService extends BaseService {
  constructor(client) {
    super(client, "/v3/orgs/:orgId/appointments");
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
  schemes() {
    return new SchemesService(this);
  }
  workOrders(schemeId) {
    return new WorkOrdersService(this, schemeId);
  }
  operations(schemeId, workOrderId) {
    return new OperationsService(this, schemeId, workOrderId);
  }
  operationTemplates() {
    return new OperationTemplatesService(this);
  }
  serviceAccountKeys() {
    return new ServiceAccountKeysService(this);
  }
  customerAccounts(customerAccountId) {
    return new CustomerAccountsService(this, customerAccountId);
  }
  contacts() {
    return new ContactsService(this);
  }
  customerInteractions() {
    return new CustomerInteractionsService(this);
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
  appointments() {
    return new AppointmentsService(this);
  }
  teams() {
    return new TeamsService(this);
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
  equipmentExposures() {
    return new EquipmentExposureService(this);
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
  vehicleModelSpecifications() {
    return new VehicleModelSpecificationService(this);
  }
  vehicleInspections() {
    return new VehicleInspectionService(this);
  }
  vehicleInventoryChecks() {
    return new VehicleInventoryCheckService(this);
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
  WorkOrder,
  VehicleSpecification,
  VehicleModel,
  VehicleManufacturer,
  VehicleCategory,
  Vehicle,
  Team,
  SubmissionVersion,
  Submission,
  ServiceAccountKey,
  ServiceAccount,
  Scheme,
  Role,
  RequestOptions,
  Property,
  Permission,
  Operation,
  Log,
  Group,
  FormCategory,
  Form,
  EquipmentModel,
  EquipmentManufacturer,
  EquipmentExposure,
  EquipmentCategory,
  Equipment,
  CustomerInteraction,
  CustomerAccount,
  Contact,
  ClientConfig,
  Client,
  Appointment
};
