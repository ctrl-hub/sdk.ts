import { describe, it, expect } from "bun:test";
import { ServiceAccount } from "../../models/ServiceAccount";

describe('ServiceAccount', () => {

    it('should correctly hydrate a ServiceAccount from valid data', () => {
        const data = {
            id: "f3ca64d7-73b1-4bfc-877a-62f7e1f9e3cb",
            attributes: {
                name: "Test Account",
                description: "This is a service account",
                email: "test@example.com",
                enabled: true
            },
            meta: { createdAt: "2023-01-01" }
        };

        const serviceAccount = ServiceAccount.hydrate(data, null);

        expect(serviceAccount.id).toBe(data.id);
        expect(serviceAccount.attributes.name).toBe(data.attributes.name);
        expect(serviceAccount.attributes.description).toBe(data.attributes.description);
        expect(serviceAccount.attributes.email).toBe(data.attributes.email);
        expect(serviceAccount.attributes.enabled).toBe(data.attributes.enabled);
        expect(serviceAccount.meta).toEqual({ createdAt: data.meta.createdAt });
    });

    it('should handle missing attributes gracefully', () => {
        const data = {
            id: "3eb21536-64bc-431d-96ce-57f2d5bb57a2",
            attributes: {
                name: "Missing Info",
            }
        };

        const serviceAccount = ServiceAccount.hydrate(data, null);

        expect(serviceAccount.id).toBe(data.id);
        expect(serviceAccount.attributes.name).toBe(data.attributes.name);
        expect(serviceAccount.attributes.description).toBe("");
        expect(serviceAccount.attributes.email).toBe("");
        expect(serviceAccount.attributes.enabled).toBe(false);
        expect(serviceAccount.meta).toEqual({});
    });

});