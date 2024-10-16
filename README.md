

## Development

### Adding a module (for this example, shoes)
1. Create a new model file in src/Models, `src/Models/Shoe.ts` which implements the `Model` interface


2. In src/services/Client.ts, add 
```typescript
// @ts-ignore
public shoes: ServiceMethods;
```
3. Within the Client.ts `constructor` add:
```typescript
this.services["shoes"] = {
  endpoint: "/v3/orgs/:orgId/shoes",
  model: Shoe as ModelConstructor<Shoe>,
  type: "shoes",
};
```

You will then be able to do the following

```typescript
let client = new Client({
    organisationId: "org-name-here",
    baseDomain: "https://base-endpoint.com",
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
