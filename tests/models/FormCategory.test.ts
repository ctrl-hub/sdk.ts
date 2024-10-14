import { describe, it, expect } from "bun:test";
import { FormCategory } from "models/FormCategory"

describe('FormCategory', () => {

    describe('hydrate', () => {
        it('should correctly hydrate a FormCategory from data', () => {
            const data = {
                id: "368eff50-b3bd-4ed1-8ea7-15530108a335",
                attributes: {
                    name: "Sample Category",
                },
                meta: {
                    createdAt: "2023-01-01",
                },
            };

            const formCategory = FormCategory.hydrate(data);

            expect(formCategory.id).toBe(data.id);
            expect(formCategory.attributes.name).toBe(data.attributes.name);
            expect(formCategory.meta).toEqual({ createdAt: data.meta.createdAt });
        });

        it('should handle missing attributes gracefully', () => {
            const data = {
                id: "d1c196a9-f9e1-49e6-89d0-af7760ab574d",
                attributes: {},
                meta: {},
            };

            const formCategory = FormCategory.hydrate(data);

            expect(formCategory.id).toBe(data.id);
            expect(formCategory.attributes.name).toBe("");
            expect(formCategory.meta).toEqual({});
        });

        it('should return an instance with default values when no data is provided', () => {
            const formCategory = FormCategory.hydrate(null);

            expect(formCategory.id).toBe("");
            expect(formCategory.attributes.name).toBe("");
            expect(formCategory.meta).toEqual({});
        });
    });
});