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

            const form = Form.hydrate(data);

            expect(form.id).toBe(data.id);
            expect(form.attributes.name).toBe(data.attributes.name);
            expect(form.attributes.description).toBe(data.attributes.description);
            expect(form.attributes.field_mappings).toEqual(data.attributes.field_mappings);
            expect(form.attributes.status).toBe(data.attributes.status);
            expect(form.meta).toEqual({ created_at: data.meta.created_at });
            expect(form.links).toEqual(data.links);
        });

        it('should handle missing attributes gracefully', () => {
            const data = {
                id: "f23a8758-7884-c9b3-f590-60398e6d",
                attributes: {},
                meta: {}
            };

            const form = Form.hydrate(data);

            expect(form.id).toBe(data.id);
            expect(form.attributes.name).toBe("");
            expect(form.attributes.description).toBe("");
            expect(form.attributes.field_mappings).toEqual([]);
            expect(form.attributes.status).toBe("");
            expect(form.meta).toEqual({});
            expect(form.links).toEqual({});
        });

        it('should return an instance with default values when no data is provided', () => {
            const form = Form.hydrate(null);

            expect(form.id).toBe("");
            expect(form.attributes.name).toBe("");
            expect(form.attributes.description).toBe("");
            expect(form.attributes.field_mappings).toEqual([]);
            expect(form.attributes.status).toBe("");
            expect(form.meta).toEqual({});
            expect(form.links).toEqual({});
        });
    });
});