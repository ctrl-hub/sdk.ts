import { describe, it, expect } from "bun:test";
import { ClientConfig, ClientConfigInterface } from "../src/ClientConfig";

describe('ClientConfig', () => {
    it('should initialize with the provided config values', () => {
        const configInterface: ClientConfigInterface = {
            organisationId: 'test-org',
            baseDomain: 'https://custom-domain.com',
            clientId: 'test-client-id',
            clientSecret: 'test-client-secret',
            authDomain: 'https://custom-auth.com'
        };

        const config = new ClientConfig(configInterface);

        expect(config.organisationId).toBe('test-org');
        expect(config.baseDomain).toBe('https://custom-domain.com');
        expect(config.clientId).toBe('test-client-id');
        expect(config.clientSecret).toBe('test-client-secret');
        expect(config.authDomain).toBe('https://custom-auth.com');
    });

    it('should set default values when optional properties are missing', () => {
        const configInterface: ClientConfigInterface = {
            organisationId: 'test-org'
        };

        const config = new ClientConfig(configInterface);

        expect(config.organisationId).toBe('test-org');
        expect(config.baseDomain).toBe('https://app.ctrl-hub.com');
        expect(config.clientId).toBe('');
        expect(config.clientSecret).toBe('');
        expect(config.authDomain).toBe('https://auth.ctrl-hub.com');
    });

    it('should use provided domains when specified', () => {
        const configInterface: ClientConfigInterface = {
            organisationId: 'test-org',
            baseDomain: 'https://staging.ctrl-hub.com',
            authDomain: 'https://staging-auth.ctrl-hub.com'
        };

        const config = new ClientConfig(configInterface);

        expect(config.baseDomain).toBe('https://staging.ctrl-hub.com');
        expect(config.authDomain).toBe('https://staging-auth.ctrl-hub.com');
    });

    it('should handle partial auth credentials', () => {
        const configInterface: ClientConfigInterface = {
            organisationId: 'test-org',
            clientId: 'test-client-id',
        };

        const config = new ClientConfig(configInterface);

        expect(config.clientId).toBe('test-client-id');
        expect(config.clientSecret).toBe('');

        const configInterface2: ClientConfigInterface = {
            organisationId: 'test-org',
            clientSecret: 'test-client-secret'
        };

        const config2 = new ClientConfig(configInterface2);

        expect(config2.clientId).toBe('');
        expect(config2.clientSecret).toBe('test-client-secret');
    });

});