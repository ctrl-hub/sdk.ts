import { Client } from './services/Client';
import { RequestOptions } from './utils/RequestOptions';
import {FormCategory} from "./models/FormCategory";

let client = new Client({
    organisationId: "ctrl-hub",
    baseDomain: "https://api.ctrl-hub.dev"
});

(async () => {
    let { data } = await client.formCategories.get(new RequestOptions({
        sort: [{ key: 'name', direction: 'desc' }]
    }));

    for (let d: FormCategory of data) {
        console.log(d.attributes.name);
    }
})();
