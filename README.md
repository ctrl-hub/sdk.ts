

## Development

### Usage
```typescript
let client = new Client({
    organisationId: "org-name-here",
    baseDomain: "https://api.ctrl-hub.dev",
    clientId: 'insert-client-id-here',
    clientSecret: 'insert-client-secret-here',
    authDomain: 'https://auth.ctrl-hub.dev' // a request will be sent to https://auth.ctrl-hub.dev/oauth2/token
});

// Get all submissions for 'org-name-here' organisation
let { data} = await client.submissions().get()
console.log(data)
```

> Note that when the SDK is ran within a browser, cookies will be forwarded with the API requests in the `Cookie` header. When authenticated, the users session token is forwarded within that header

### Adding a module (for this example, shoes)
1. Create a new model file in src/Models, `src/Models/Shoe.ts` which implements the `Model` interface

2. Create a new service which extends BaseService in src/services e.g.

```typescript
import {BaseService} from "../services/BaseService";
import {Shoe} from "../models/Shoe";
import {Client} from "Client";

export class ShoeService extends BaseService<Form> {
    constructor(client: Client) {
        super(client, "/v3/orgs/:orgId/shoes", Shoe.hydrate);
    }
}
```

3. In src/services/BaseService.ts, add the model within the constructor 
```typescript
        this.models["shoes"] = Shoe as ModelConstructor<Shoe>;
```

You will then be able to do the following

```typescript
let client = new Client({
    organisationId: "org-name-here",
    baseDomain: "https://api.ctrl-hub.dev",
    clientId: 'insert-client-id-here',
    clientSecret: 'insert-client-secret-here',
    authUrl: 'https://auth.ctrl-hub.dev/oauth2/token'
});

// any options, sorts, filters etc.
let options = {
    limit: 10,
    offset: 0,
    sort: [
        {
            field: "name",
            direction: "desc",
        },
    ],
    filters: [
        {
            key: "category.id",
            value: "be780a63-6944-4305-943c-e715e9177371",
        },
    ],
    include: [
        "related-model-1", "related-model-2"
    ]
} 

let shoesResponse = client.shoes.get();
```

The above would send a GET request to `https://base-endpoint.com/v3/orgs/org-name-here/shoes?limit=10&offset=0&sort=-name&filter[category.id]=be780a63-6944-4305-943c-e715e9177371`



### Building the project
Everything in the src/ directory will be compiled to the dist/ directory

`bun run build`

### Hot usage while developing
Will auto reload on file changes (assuming you have a root file called index.ts)

`bun --hot index.ts` 

### Tests
Tests are all located in "tests" in the same structure as the source files

`bun test`

`bun test --coverage`
