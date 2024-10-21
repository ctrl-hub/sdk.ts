import { describe, it, expect, beforeEach, spyOn } from "bun:test";
import { Client } from "../../src";
import { Permission } from "../../src/models/Permission";
import { PermissionsService } from "../../src/services/PermissionsService";

describe('PermissionsService', () => {
    let client: Client;

    beforeEach(() => {
        // Initialize a fresh instance of Client
        client = new Client({
            organisationId: '12345',
            baseDomain: 'https://api.example.com'
        });

        // Mocking the `makeGetRequest` method of the Client to return mock data
        spyOn(client, 'makeGetRequest').mockResolvedValue({
            data: {
                id: 'mock-permission-id',
                type: 'permissions',
                attributes: {
                    description: 'Permission to read resources'
                }
            }
        });
    });

    it('should fetch a permission with the correct endpoint', async () => {
        const mockId = "mock-permission-id";
        const permissionsService = new PermissionsService(client);

        // Fetching the permission by ID
        const { data } = await permissionsService.get(mockId);

        // Checking the permission attributes
        expect(data.attributes.description).toBe('Permission to read resources');
        expect(data).toBeInstanceOf(Permission);

        // Verifying that the correct endpoint was called
        const expectedUrl = 'https://api.example.com/v3/admin/permissions';
        expect(client.makeGetRequest).toHaveBeenCalledTimes(1);
        expect(client.makeGetRequest).toHaveBeenCalledWith(expectedUrl, mockId);
    });
});