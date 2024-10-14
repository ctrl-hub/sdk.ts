import { describe, it, expect } from "bun:test";
import { ServiceAccountKey } from "models/ServiceAccountKey";

describe('ServiceAccountKey', () => {

    it('should initialize with default values', () => {
        const serviceAccountKey = new ServiceAccountKey();

        expect(serviceAccountKey.id).toBe('');
        expect(serviceAccountKey.type).toBe('service-account-keys');
        expect(serviceAccountKey.attributes.client_id).toBe('');
        expect(serviceAccountKey.meta).toEqual({});
        expect(serviceAccountKey.relationships).toBeUndefined();
    });

    describe('hydrate', () => {
        it('should correctly hydrate a ServiceAccountKey from valid data', () => {
            const data = {
                id: "99b6e5dd-ae3d-42cd-abbf-a9480bda4728",
                attributes: {
                    client_id: "client-001",
                },
                meta: { createdAt: "2023-01-01" }
            };

            const serviceAccountKey = ServiceAccountKey.hydrate(data, null);

            expect(serviceAccountKey.id).toBe(data.id);
            expect(serviceAccountKey.attributes.client_id).toBe(data.attributes.client_id);
            expect(serviceAccountKey.meta).toEqual(data.meta);
        });

        it('should handle missing attributes gracefully', () => {
            const data = {
                id: "dd0acdc9-ae16-4db8-bf20-0db2a4afa9bc",
                attributes: {}
            };

            const serviceAccountKey = ServiceAccountKey.hydrate(data, null);

            expect(serviceAccountKey.id).toBe(data.id);
            expect(serviceAccountKey.attributes.client_id).toBe("");
        });
    });
});