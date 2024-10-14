export class ClientConfig {
    organisationId;
    baseDomain;
    constructor(config) {
        this.organisationId = config.organisationId;
        this.baseDomain = config.baseDomain || 'https://app.ctrl-hub.com';
    }
}
