import { Client } from './src';
import { Equipment } from './src/models/Equipment';
import {FormCategory} from "./src/models/FormCategory";
import {ClientConfig} from "./dist";
import {Form} from "./src/models/Form";
import { RequestOptions } from './dist/utils/RequestOptions';
import { ServiceAccount } from './src/models/ServiceAccount';
import { Vehicle } from './src/models/Vehicle';


// let config = new ClientConfig()



// let { data } = await client.forms.get({
//     sort: [{ key: 'name', direction: 'desc' }],
//     limit: 2,
//     offset: 2
// });

// let { data } = await client.forms.get({
//     sort: [
//         {
//             key: 'name',
//             direction: 'asc'
//         }
//     ],
//     filters: [
//         {
//             key: 'categories.id',
//             value: 'b60e2af5-6a84-0eb0-feaa-84384a94'
//         }
//     ]
// });
//
// for(let d: Form of data) {
//     console.log(d.attributes.name);
// }

// let serviceAccount = new ServiceAccount();
// serviceAccount.attributes.name = "test";
// let resp = client.create(serviceAccount);
// console.log(resp);

// const getToken = async () => {
//     const url = "https://auth.ctrl-hub.dev/oauth2/token";
//
//     const params = new URLSearchParams();
//     params.append("grant_type", "client_credentials");
//     params.append("client_id", clientId);
//     params.append("client_secret", clientSecret);
//
//     const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
//         },
//         body: params.toString()
//     });
//
//     return response.json();
// }

let client = new Client({
    organisationId: "ctrl-hub",
    baseDomain: "https://api.ctrl-hub.dev",
    clientId: '399354ec-12d2-4df3-b09c-05d91d6f17a7',
    clientSecret: 'xnrwu2BQOXKPKIiTUvMLcU8-jW',
    authDomain: 'https://auth.ctrl-hub.dev'
});

let resp = await client.vehicles().motRecords("705ec18e-5c15-4d02-83c8-5c75c97cb157");

console.log(resp.data);

// let resp = await client.submissions().get()
// console.log(resp.data.length);
// await delay(30*1000)
//
// resp = await client.submissions().get()
// console.log(resp.data.length);
//
// // Fetch request using POST method

//
// // Parse the response as JSON
// const data = await response.json();
// console.log(data);
