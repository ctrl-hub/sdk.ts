export class PropertiesService {
    client;
    baseEndpoint;
    finalEndpoint;
    constructor(client) {
        this.baseEndpoint = '/v3/governance/properties';
        this.client = client;
        this.finalEndpoint = this.client.finalEndpoint(this.baseEndpoint);
    }
    getMultipleProperties = async (uprns) => {
        const filterQuery = uprns.map(uprn => `filter[uprn]=${encodeURIComponent(uprn)}`).join('&');
        return await this.client.makeGetRequest(`${this.finalEndpoint}?${filterQuery}`);
    };
    getSingleProperty = async (uprn) => {
        const url = this.client.finalEndpoint(this.baseEndpoint);
        return await this.client.makeGetRequest(url, uprn);
    };
    async get(uprns) {
        return Array.isArray(uprns) ? this.getMultipleProperties(uprns) : this.getSingleProperty(uprns);
    }
}
