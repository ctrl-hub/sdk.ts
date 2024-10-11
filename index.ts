import { Client } from './services/Client';
import {FormCategory} from "./models/FormCategory";

let client = new Client({
    organisationId: "ctrl-hub",
    baseDomain: "https://api.ctrl-hub.dev"
});

(async () => {
    let { data } = await client.formCategories.get({
        sort: [{ key: 'name', direction: 'desc' }],
        limit: 2
    });

    for (let d: FormCategory of data) {
        console.log(d.attributes.name);
    }
})();
