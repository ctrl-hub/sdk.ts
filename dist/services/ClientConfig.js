"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientConfig = void 0;
class ClientConfig {
    organisationId;
    baseDomain;
    constructor(config) {
        this.organisationId = config.organisationId;
        this.baseDomain = config.baseDomain || 'https://app.ctrl-hub.com';
    }
}
exports.ClientConfig = ClientConfig;
