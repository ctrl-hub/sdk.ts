import { describe, it, expect } from "bun:test";
import { Role } from "@models/Role";

describe('Role', () => {

    describe('hydrate', () => {
        it('should correctly hydrate a Role from data', () => {
            const data = {
                id: "5f9c2b8b-dfc2-4476-bbca-6d0e5d94a6ad",
                attributes: {
                    custom: true,
                    name: "Admin",
                    description: "Administrator role",
                    launch_stage: "beta",
                    permissions: ["read", "write", "execute"]
                },
                meta: {
                    createdAt: "2023-01-01",
                },
            };

            const role = Role.hydrate(data);

            expect(role.id).toBe(data.id);
            expect(role.attributes.custom).toBe(true);
            expect(role.attributes.name).toBe("Admin");
            expect(role.attributes.description).toBe("Administrator role");
            expect(role.attributes.launch_stage).toBe("beta");
            expect(role.attributes.permissions).toEqual(["read", "write", "execute"]);
            expect(role.meta).toEqual({ createdAt: data.meta.createdAt });
        });

        it('should handle missing attributes gracefully', () => {
            const data = {
                id: "2f0e9d5b-1234-42d5-8e8d-456a54e4b16d",
                attributes: {},
                meta: {},
            };

            const role = Role.hydrate(data);

            expect(role.id).toBe(data.id);
            expect(role.attributes.custom).toBe(false);
            expect(role.attributes.name).toBe("");
            expect(role.attributes.description).toBe("");
            expect(role.attributes.launch_stage).toBe("");
            expect(role.attributes.permissions).toEqual([]);
            expect(role.meta).toEqual({});
        });

        it('should return an instance with default values when no data is provided', () => {
            const role = Role.hydrate(null);

            expect(role.id).toBe("");
            expect(role.attributes.custom).toBe(false);
            expect(role.attributes.name).toBe("");
            expect(role.attributes.description).toBe("");
            expect(role.attributes.launch_stage).toBe("");
            expect(role.attributes.permissions).toEqual([]);
            expect(role.meta).toEqual({});
        });
    });
});
