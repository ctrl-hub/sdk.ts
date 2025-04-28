import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { Client } from "../src/Client";
import { RequestOptions } from "../src/utils/RequestOptions";

describe('Client HTTP Methods', () => {
    let client: Client;
    let mockFetch: any;
    const originalFetch = global.fetch;

    const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: () => Promise.resolve({ data: { id: 'test-id', type: 'test-type' } })
    };

    beforeEach(() => {
        // Setup mock fetch
        mockFetch = mock(() => Promise.resolve(mockResponse));
        global.fetch = mockFetch;

        // Initialize client with test config
        client = new Client({
            organisationId: "test-org",
            baseDomain: "https://test-api.com",
            clientId: "test-client",
            clientSecret: "test-secret",
            authDomain: "https://test-auth.com"
        });

        // Set token directly to skip authentication
        client.bearerToken = "test-token";
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    // Test PATCH request
    it('should make PATCH requests with correct parameters', async () => {
        const testBody = { data: { type: 'test-type', attributes: { name: 'Test' } } };
        const requestOptions = new RequestOptions({ limit: 10 });

        await client.makePatchRequest("/test-endpoint", testBody, requestOptions);

        expect(mockFetch).toHaveBeenCalledWith(
            "https://test-api.com/test-endpoint?limit=10",
            expect.objectContaining({
                method: 'PATCH',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer test-token'
                }),
                credentials: 'include',
                body: JSON.stringify(testBody)
            })
        );
    });

    // Test POST request
    it('should make POST requests with correct parameters', async () => {
        const testBody = { data: { type: 'test-type', attributes: { name: 'Test' } } };

        await client.makePostRequest("/test-endpoint", testBody);

        expect(mockFetch).toHaveBeenCalledWith(
            "https://test-api.com/test-endpoint",
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer test-token'
                }),
                credentials: 'include',
                body: JSON.stringify(testBody)
            })
        );
    });

    // Test DELETE request
    it('should make DELETE requests with correct parameters', async () => {
        await client.makeDeleteRequest("/test-endpoint");

        expect(mockFetch).toHaveBeenCalledWith(
            "https://test-api.com/test-endpoint",
            expect.objectContaining({
                method: 'DELETE',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer test-token'
                }),
                credentials: 'include'
            })
        );
    });

    // Test error handling in fetch requests
    it('should handle network errors in requests', async () => {
        global.fetch = mock(() => Promise.reject(new Error("Network error")));

        const response = await client.makeGetRequest("/test-endpoint");

        expect(response.ok).toBe(false);
        expect(response.errors.network).toHaveLength(1);
        expect(response.errors.network[0].message).toBe("Network error");
    });

    // Test JSON parse error handling
    it('should handle JSON parsing errors', async () => {
        global.fetch = mock(() => Promise.resolve({
            ok: true,
            status: 200,
            headers: new Headers(),
            json: () => Promise.reject(new Error("JSON parse error"))
        }));

        const response = await client.makeGetRequest("/test-endpoint");

        expect(response.ok).toBe(false);
        expect(response.errors.network).toHaveLength(1);
        expect(response.errors.network[0].message).toBe("JSON parse error");
    });
});

describe('Client Service Factory Methods', () => {
    let client: Client;

    beforeEach(() => {
        client = new Client({
            organisationId: "test-org",
            baseDomain: "https://test-api.com"
        });
    });

    // Test all service factory methods
    it('should create all service instances', () => {
        expect(client.appointments()).toBeDefined();
        expect(client.contacts()).toBeDefined();
        expect(client.customerInteractions()).toBeDefined();
        expect(client.equipment()).toBeDefined();
        expect(client.equipmentCategories()).toBeDefined();
        expect(client.equipmentManufacturers()).toBeDefined();
        expect(client.equipmentModels()).toBeDefined();
        expect(client.formCategories()).toBeDefined();
        expect(client.forms()).toBeDefined();
        expect(client.operationTemplates()).toBeDefined();
        expect(client.organisationMembers()).toBeDefined();
        expect(client.organisations()).toBeDefined();
        expect(client.permissions()).toBeDefined();
        expect(client.properties()).toBeDefined();
        expect(client.roles()).toBeDefined();
        expect(client.schemeTemplates()).toBeDefined();
        expect(client.schemes()).toBeDefined();
        expect(client.serviceAccountKeys()).toBeDefined();
        expect(client.serviceAccounts()).toBeDefined();
        expect(client.submissions()).toBeDefined();
        expect(client.vehicleCategories()).toBeDefined();
        expect(client.vehicleInspections()).toBeDefined();
        expect(client.vehicleInventoryChecks()).toBeDefined();
        expect(client.vehicleManufacturers()).toBeDefined();
        expect(client.vehicleModelSpecifications()).toBeDefined();
        expect(client.vehicleModels()).toBeDefined();
        expect(client.workOrderTemplates()).toBeDefined();

        expect(client.customerAccounts("customer-1")).toBeDefined();
        expect(client.equipmentExposures("equipment-1")).toBeDefined();
        expect(client.groups("group-1")).toBeDefined();
        expect(client.operations("scheme-1", "work-order-1")).toBeDefined();
        expect(client.teams("team-1")).toBeDefined();
        expect(client.vehicles("vehicle-1")).toBeDefined();
        expect(client.workOrders("scheme-1")).toBeDefined();
    });
});