import { ClientInterface } from "./clientInterface"
import { apiResponseInterface } from "./apiResponseInterface"

type FormCategoryAttributes = {
  name: String;
  location: {
    coordinates: number[];
  }
}

class FormCategory implements ClientInterface {
  public id: string
  endpoint: string = '/v3/orgs/:orgId/data-capture/form-categories'
  type: string = 'form-categories'
  attributes: FormCategoryAttributes;

  constructor() {
    this.attributes = {
      name: '',
      location: {
        coordinates: []
      }
    }
  }
}

// client.formCategories.get({
//   filter: {
//     ''
//   },
//   limit: 5,
//   offset: 5,
//   sort: {
//     key: 'name',
//     direction: 'desc',
//   },
//   include: ['forms']
// })


type Sort = {
  key: String;
  direction?: 'asc' | 'desc'
}

type RequestOptionsType = {
  sort?: Sort[]
}

class RequestOptions {

  sort?: Sort[];

  constructor(options: RequestOptionsType){

    if (options.sort) {
      this.sort = options.sort
    }

  }

  toURLSearchParams(): URLSearchParams {

    let params = new URLSearchParams();

    if (this.sort && this.sort.length) {

      let sortLength = this.sort.length;

      let sortString = '';

      this.sort.forEach((sort, index) => {

        if (sort.direction === 'desc') {
          sortString += '-';
        }

        sortString += sort.key

        if (index == sortLength + 1) {
          sortString += ',';
        }

      });

      params.append('sort', sortString)

    }

    return params;

  }

}



class Client {

  readonly config: ClientConfig;

  public organisation: String;

  finalEndpoint(model: ClientInterface): string {
    let { endpoint } = model
    let path = endpoint.replace(':orgId', this.config.organisationId.toString())
    return this.config.baseDomain + path;
  }

  buildRequestURL(baseEndpoint: string, param?: string|RequestOptions|null): string {
    let endpoint = baseEndpoint;
    let requestOptions: Object;

      switch (typeof param) {

        case "string":
         endpoint  += `/${param}`
          break;

        case "object":
           endpoint += '?' + param?.toURLSearchParams().toString()
          break;
      }

    console.log(endpoint);
    return endpoint;
  }

  hydrateResponse(json: any, model: ClientInterface)
  {
    if (json.data.length > 0) {
      for(let j of json.data) {
        console.log(j.attributes.name)
      }
    } else {
      // @todo hydrate new FormCategory
      console.log(json.data.attributes.name);
    }
  }

  async makeGetRequest(baseEndpoint: String, param?: string|RequestOptions|null) {

    let url = this.buildRequestURL(baseEndpoint.toString(), param);

    let response: any;
    let json: any;

    try {
      response = await fetch(url)
    } catch (error) {
      console.error(error);
    }

    // response = await fetch(endpoint + '?sort=-name&limit=2', {})
    return response;
  }

  formCategories() {
    let model = new FormCategory();

     let baseEndpoint = this.finalEndpoint(model)

     return {
       get: async (param?: string|RequestOptions|null) => {

         let response = await this.makeGetRequest(baseEndpoint, param);
         let json = await response.json()

           this.hydrateResponse(json, model)
       }
     }

  }

  constructor(config: ClientConfig) {
    this.config = config;
  }

  setOrganisationSlug(organisation: string) {
    this.config.organisationId = organisation;
  }

  create(model: ClientInterface) {
    console.log(JSON.stringify({
      action: 'create',
      type: model.type,
      organisation: this.organisation,
      endpoint: this.finalEndpoint(model),
      entity: model,
    }, null, 2));
  }

  update(model: ClientInterface){
    console.log(JSON.stringify({
      action: 'update',
      type: model.type,
      organisation: this.organisation,
      endpoint: this.finalEndpoint(model),
      entity: model,
    }, null, 2));
  }

}

type ClientConfigInterface = {
  organisationId: String;
  baseDomain?: String;
}

class ClientConfig {

  public organisationId: String;

  public baseDomain: String;

  constructor(config: ClientConfigInterface) {
    this.organisationId = config.organisationId;

    // @todo strip end /
    this.baseDomain = config.baseDomain || 'https://app.ctrl-hub.com'
  }

}

let client = new Client({
  organisationId: "ctrl-hub",
  baseDomain: "https://api.ctrl-hub.dev"
});

// let formCategory = new FormCategory();
// formCategory.attributes = {
//   name: 'Test',
//   location: {
//     coordinates: [1.1, 2],
//   }
// }
// client.create(formCategory);

// client.setOrganisationSlug("engineering")
// client.create(formCategory);

// formCategory.attributes.name = 'Different Name'
// client.update(formCategory);


// let { errors, statusCode, status, category: FormCategory } = await client.formCategories.get('91c78477-715f-496c-a12c-f1a0862db472');

// await client.formCategories.get('91c78477-715f-496c-a12c-f1a0862db472').then(response => {
//   let { errors, statusCode, status, formCategory } = response;
//   formCategory.name = 'abc';
//   client.update(formCategory);
// })
// // 5e325d0f-e614-4f82-3fa4-31c150fb

await client.formCategories().get("5e325d0f-e614-4f82-3fa4-31c150fb");


await client.formCategories().get(new RequestOptions({
  sort: [{
    key: 'name',
    direction: 'asc' // -name
  }]
}));

await client.formCategories().get(new RequestOptions({
  sort: [{
    key: 'name',
    direction: 'desc' // -name
  }]
}));


await client.formCategories().get();


// await client.formCategories()
//   .addSort('name', 'asc')
//   .addInclude('forms')
//   .addFilter('name', 'John Smith')
//   .get()

// ?filter[name]=John S

// await client.formCategories().addSort('name').get()


// let url = 'https://api.ctrl-hub.dev/v3/orgs/ctrl-hub/data-capture/form-categories';


// fetch(url, {})
//   .then((res) => res.json())
//   .then((res) => console.log(res))
