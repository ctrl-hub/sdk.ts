import { describe, it, expect } from "bun:test";
import { ServiceAccount } from "@models/ServiceAccount";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

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

        const serviceAccount = new ServiceAccount(data);

        expect(serviceAccount.id).toBe(data.id);
        expect(serviceAccount.name).toBe(data.attributes.name);
        expect(serviceAccount.description).toBe(data.attributes.description);
        expect(serviceAccount.email).toBe(data.attributes.email);
        expect(serviceAccount.enabled).toBe(data.attributes.enabled);
        expect(serviceAccount.meta).toEqual({ createdAt: data.meta.createdAt });
    });

    it('should handle missing attributes gracefully', () => {
        const data = {
            id: "3eb21536-64bc-431d-96ce-57f2d5bb57a2",
            attributes: {
                name: "Missing Info",
            }
        };

        const serviceAccount = new ServiceAccount(data);

        expect(serviceAccount.id).toBe(data.id);
        expect(serviceAccount.name).toBe(data.attributes.name);
        expect(serviceAccount.description).toBe("");
        expect(serviceAccount.email).toBe("");
        expect(serviceAccount.enabled).toBe(false);
        expect(serviceAccount.meta).toEqual(undefined);
    });

    it('should return correct jsonApiMapping', () => {
        const serviceAccount = new ServiceAccount();
        const mapping = serviceAccount.jsonApiMapping();
        
        expect(mapping.attributes).toEqual(['name', 'description']);
    });
    
    it('should generate correct create and update payloads', () => {
        const data = {
            id: "f3ca64d7-73b1-4bfc-877a-62f7e1f9e3cb",
            attributes: {
                name: "Test Account",
                description: "This is a service account",
                email: "test@example.com",
                enabled: true
            }
        };
        
        const serviceAccount = new ServiceAccount(data);
        const hydrator = new Hydrator();
        const serializer = new JsonApiSerializer(hydrator.getModelMap());
        
        // Test create payload
        const createPayload = serializer.buildCreatePayload(serviceAccount);
        expect(createPayload).toEqual({
            data: {
                type: "service-accounts",
                attributes: {
                    name: "Test Account",
                    description: "This is a service account"
                },
                relationships: {}
            }
        });
        
        // Test update payload
        const updatePayload = serializer.buildUpdatePayload(serviceAccount);
        expect(updatePayload).toEqual({
            data: {
                id: "f3ca64d7-73b1-4bfc-877a-62f7e1f9e3cb",
                type: "service-accounts",
                attributes: {
                    name: "Test Account",
                    description: "This is a service account"
                },
                relationships: {}
            }
        });
    });
});