import { describe, it, expect } from "bun:test";
import { Form } from "@models/Form";

describe('Form', () => {

    describe('hydrate', () => {
        it('should correctly hydrate a Form from data', () => {
            const data = {
                id: "f23a8758-7884-c9b3-f590-60398e6d",
                attributes: {
                    name: "Covid 19 Risk Assessment",
                    description: "Covid 19 Risk Assessment",
                    field_mappings: [
                        { from: "", to: "organisation_id" },
                        { from: "", to: "scheme_id" }
                    ],
                    status: "published"
                },
                meta: {
                    created_at: "2020-06-24T12:12:10Z",
                },
                links: {
                    self: "https://api.ctrl-hub.dev/schemas/f23a8758-7884-c9b3-f590-60398e6d",
                    submissions: "https://api.ctrl-hub.dev/schemas/f23a8758-7884-c9b3-f590-60398e6d/submissions"
                }
            };

            const form = new Form(data);

            expect(form.id).toBe(data.id);
            expect(form.name).toBe(data.attributes.name);
            expect(form.description).toBe(data.attributes.description);
            expect(form.fieldMappings).toEqual(data.attributes.field_mappings);
            expect(form.status).toBe(data.attributes.status);
            expect(form.meta).toEqual({ created_at: data.meta.created_at });
            expect(form.links).toEqual(data.links);
        });

        it('should handle missing attributes gracefully', () => {
            const data = {
                id: "f23a8758-7884-c9b3-f590-60398e6d",
                attributes: {},
                meta: {}
            };

            const form = new Form(data);

            expect(form.id).toBe(data.id);
            expect(form.name).toBe("");
            expect(form.description).toBe("");
            expect(form.fieldMappings).toEqual([]);
            expect(form.status).toBe("");
            expect(form.meta).toEqual(undefined);
            expect(form.links).toEqual(undefined);
        });

        it('should return an instance with default values when no data is provided', () => {
            const form = new Form(null);

            expect(form.id).toBe("");
            expect(form.name).toBe("");
            expect(form.description).toBe("");
            expect(form.fieldMappings).toEqual([]);
            expect(form.status).toBe("");
            expect(form.meta).toEqual(undefined);
            expect(form.links).toEqual(undefined);
        });
    });
});