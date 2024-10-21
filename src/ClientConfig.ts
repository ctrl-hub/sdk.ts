export type ClientConfigInterface = {
    organisationId: string;
    baseDomain: string;
    clientId?: string;
    clientSecret?: string;
    authUrl?: string;
};

export class ClientConfig {
    public organisationId: string;
    public baseDomain: string;
    public clientId: string;
    public clientSecret: string;
    public authUrl: string;

    constructor(config: ClientConfigInterface) {
        this.organisationId = config.organisationId;
        this.baseDomain = config.baseDomain || 'https://app.ctrl-hub.com';
        this.clientId = config.clientId || '';
        this.clientSecret = config.clientSecret || '';
        this.authUrl = config.authUrl || '';
    }
}