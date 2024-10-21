export class ClientConfig {
    organisationId;
    baseDomain;
    clientId;
    clientSecret;
    authUrl;
    constructor(config) {
        this.organisationId = config.organisationId;
        this.baseDomain = config.baseDomain || 'https://app.ctrl-hub.com';
        this.clientId = config.clientId || '';
        this.clientSecret = config.clientSecret || '';
        this.authUrl = config.authUrl || '';
    }
}
