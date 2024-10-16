import { describe, it, expect } from "bun:test";
import { Permission } from "@models/Permission"

describe('Permission', () => {

    describe('hydrate', () => {
        it('should correctly hydrate a Permission from data', () => {
            const data = {
                id: "368eff50-b3bd-4ed1-8ea7-15530108a335",
                attributes: {
                    description: "Sample Permission",
                },
                meta: {
                    createdAt: "2023-01-01",
                },
            };

            const permission = Permission.hydrate(data);

            expect(permission.id).toBe(data.id);
            expect(permission.attributes.description).toBe(data.attributes.description);
            expect(permission.meta).toEqual({ createdAt: data.meta.createdAt });
        });

        it('should handle missing attributes gracefully', () => {
            const data = {
                id: "d1c196a9-f9e1-49e6-89d0-af7760ab574d",
                attributes: {},
                meta: {},
            };

            const permission = Permission.hydrate(data);

            expect(permission.id).toBe(data.id);
            expect(permission.attributes.description).toBe("");
            expect(permission.meta).toEqual({});
        });

        it('should return an instance with default values when no data is provided', () => {
            const permission = Permission.hydrate(null);

            expect(permission.id).toBe("");
            expect(permission.attributes.description).toBe("");
            expect(permission.meta).toEqual({});
        });
    });
});