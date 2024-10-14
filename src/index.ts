import { Client } from './services/Client';
import {FormCategory} from "./models/FormCategory";

let client = new Client({
    organisationId: "ctrl-hub",
    baseDomain: "https://api.ctrl-hub.dev"
});

// (async () => {
//     client.setOrganisationSlug('ef0fcfd6-2a18-4c27-b2c2-b2563859b3b1');
//
//     let response = await client.serviceAccounts.get();
//     // let response = await client.serviceAccounts.get();
//     // console.log(response.data[0].relationships.keys.data);
//
//     console.log(response.data);
//
//     // let { data } = await client.formCategories.get({
//     //     sort: [{ key: 'name', direction: 'desc' }],
//     //     limit: 2
//     // });
//     //
//     // for (let d: FormCategory of data) {
//     //     console.log(d);
//     // }
// })();

let { data } = await client.formCategories.get({
    sort: [{ key: 'name', direction: 'desc' }],
    limit: 2,
    offset: 2
});

for (let d: FormCategory of data) {
    console.log(d.attributes.name);
}