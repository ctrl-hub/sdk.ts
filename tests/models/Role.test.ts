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

            const role = new Role(data);

            expect(role.id).toBe(data.id);
            expect(role.custom).toBe(true);
            expect(role.name).toBe("Admin");
            expect(role.description).toBe("Administrator role");
            expect(role.launch_stage).toBe("beta");
            expect(role.permissions).toEqual(["read", "write", "execute"]);
            expect(role.meta).toEqual({ createdAt: data.meta.createdAt });
        });

        it('should handle missing attributes gracefully', () => {
            const data = {
                id: "2f0e9d5b-1234-42d5-8e8d-456a54e4b16d",
                attributes: {},
                meta: {},
            };

            const role = new Role(data);

            expect(role.id).toBe(data.id);
            expect(role.custom).toBe(false);
            expect(role.name).toBe("");
            expect(role.description).toBe("");
            expect(role.launch_stage).toBe("");
            expect(role.permissions).toEqual([]);
            expect(role.meta).toEqual(undefined);
        });

        it('should return an instance with default values when no data is provided', () => {
            const role = new Role(null);

            expect(role.id).toBe("");
            expect(role.custom).toBe(false);
            expect(role.name).toBe("");
            expect(role.description).toBe("");
            expect(role.launch_stage).toBe("");
            expect(role.permissions).toEqual([]);
            expect(role.meta).toEqual(undefined);
        });
    });
});
