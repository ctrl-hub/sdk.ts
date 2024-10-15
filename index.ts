import { Client } from './src';
import {FormCategory} from "./src/models/FormCategory";
import {ClientConfig} from "./dist";



let clientId = '6ae23766-04b9-4f4d-b688-ac02a7bc6dd5';
let clientSecret = 'zKq6_.UOO7ABf-G0NskewO7Y.3';



// let config = new ClientConfig()

let client = await Client.create({
    organisationId: "ctrl-hub",
    baseDomain: "https://api.ctrl-hub.dev",
    credentials: {
        client_id: clientId,
        client_secret: clientSecret,
        session_token: '',
    }
});

let { data } = await client.formCategories.get({
    sort: [{ key: 'name', direction: 'desc' }],
    limit: 2,
    offset: 2
});

for (let d: FormCategory of data) {
    console.log(d.attributes.name);
}

// let { data } = await client.submissions.get();

// console.log(data);