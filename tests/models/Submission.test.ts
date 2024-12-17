import { describe, it, expect } from "bun:test";
import { Submission } from "@models/Submission";

describe('Submission', () => {

    describe('hydrate', () => {

        it('should correctly hydrate a Submission from data', () => {
            const data = {
                id: "abc123",
                attributes: {
                    reference: "SUB-001",
                    status: "completed",
                },
                meta: {
                    created_at: "2024-01-01T12:00:00Z",
                },
                links: {
                    self: "https://api.example.com/submissions/abc123",
                }
            };

            const submission = new Submission(data);

            expect(submission.id).toBe(data.id);
            expect(submission.reference).toBe(data.attributes.reference);
            expect(submission.status).toBe(data.attributes.status);
            expect(submission.meta).toEqual(data.meta);
            expect(submission.links).toEqual(data.links);
        });

        it('should handle missing attributes gracefully', () => {
            const data = {
                id: "xyz789",
                attributes: {},
                meta: {},
                links: {}
            };

            const submission = new Submission(data);

            expect(submission.id).toBe(data.id);
            expect(submission.reference).toBe("");
            expect(submission.status).toBe("");
            expect(submission.meta).toEqual(undefined);
            expect(submission.links).toEqual(undefined);
        });

        it('should return an instance with default values when no data is provided', () => {
            const submission = new Submission(null);

            expect(submission.id).toBe("");
            expect(submission.reference).toBe("");
            expect(submission.status).toBe("");
            expect(submission.meta).toEqual(undefined);
            expect(submission.links).toEqual(undefined);
        });

    });
});