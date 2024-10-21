import { describe, it, expect, beforeEach, spyOn } from "bun:test";
import { Client } from "../../src";
import { Role } from "../../src/models/Role";
import { RolesService } from "../../src/services/RolesService";

describe('RolesService', () => {
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
                id: 'mock-role-id',
                type: 'roles',
                attributes: {
                    custom: true,
                    name: 'Admin Role',
                    description: 'Administrator role with full permissions',
                    launch_stage: 'beta',
                    permissions: ['read', 'write', 'delete']
                }
            }
        });
    });

    it('should fetch a role with the correct endpoint', async () => {
        const mockId = "mock-role-id";
        const rolesService = new RolesService(client);

        // Fetching the role by ID
        const { data } = await rolesService.get(mockId);

        // Checking the role attributes
        expect(data.attributes.name).toBe('Admin Role');
        expect(data.attributes.description).toBe('Administrator role with full permissions');
        expect(data.attributes.permissions).toEqual(['read', 'write', 'delete']);
        expect(data).toBeInstanceOf(Role);

        // Verifying that the correct endpoint was called
        const expectedUrl = 'https://api.example.com/v3/admin/iam/roles';
        expect(client.makeGetRequest).toHaveBeenCalledTimes(1);
        expect(client.makeGetRequest).toHaveBeenCalledWith(expectedUrl, mockId);
    });
});