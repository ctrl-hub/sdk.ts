import { Client } from './services/Client';
import { RequestOptions } from './utils/RequestOptions';

let client = new Client({
    organisationId: "ctrl-hub",
    baseDomain: "https://api.ctrl-hub.dev"
});

(async () => {
    const response = await client.formCategories.get(new RequestOptions({
        sort: [{ key: 'name', direction: 'asc' }]
    }));

    console.log(response);
})();
