import { Client } from './services/Client';
import { RequestOptions } from './utils/RequestOptions';

let client = new Client({
    organisationId: "ctrl-hub",
    baseDomain: "https://api.ctrl-hub.dev1"
});

(async () => {
    // let response = await client.formCategories.get(new RequestOptions({
    //     sort: [{ key: 'name', direction: 'asc' }]
    // }));

    let valid = "161bd6bd-adf4-83b1-8fa3-59d1b821"
    let invalid = "test"
    // single
    let response = await client.formCategories.get(invalid);

    console.log(JSON.stringify(response, null, 2));
})();
