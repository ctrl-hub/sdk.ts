import { describe, it, expect } from "bun:test";
import { FormCategory } from "@models/FormCategory"

describe('FormCategory', () => {
    describe('constructor', () => {
        it('should correctly create a FormCategory from data', () => {
            const data = {
                id: "368eff50-b3bd-4ed1-8ea7-15530108a335",
                type: "form_categories",
                attributes: {
                    name: "Sample Category"
                },
                meta: {
                    createdAt: "2023-01-01"
                }
            };

            const formCategory = new FormCategory(data);

            expect(formCategory.id).toBe(data.id);
            expect(formCategory.type).toBe("form_categories");
            expect(formCategory.name).toBe(data.attributes.name);
            expect(formCategory.meta).toEqual({ createdAt: data.meta.createdAt });
        });

        it('should handle missing attributes gracefully', () => {
            const data = {
                id: "d1c196a9-f9e1-49e6-89d0-af7760ab574d",
                type: "form_categories"
            };

            const formCategory = new FormCategory(data);

            expect(formCategory.id).toBe(data.id);
            expect(formCategory.type).toBe("form_categories");
            expect(formCategory.name).toBe("");
            expect(formCategory.meta).toBeUndefined();
        });

        it('should initialize with default values when no data is provided', () => {
            const formCategory = new FormCategory();

            expect(formCategory.id).toBe("");
            expect(formCategory.type).toBe("form_categories");
            expect(formCategory.name).toBe("");
            expect(formCategory.meta).toBeUndefined();
        });
    });
});