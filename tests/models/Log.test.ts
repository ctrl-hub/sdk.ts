import { describe, it, expect } from "bun:test";
import { Log } from "@models/Log";

describe('Log', () => {

    describe('hydrate', () => {
        it('should correctly hydrate a Log from data', () => {
            const data = {
                id: "8ec0fb09-5b6c-42ff-a712-f91fde05ec2e",
                attributes: {
                    actor: {
                        type: "user",
                        id: "user456"
                    },
                    duration: 120,
                    request: {
                        time: "2023-01-01T12:00:00Z",
                        headers: {
                            "Content-Type": ["application/json"]
                        },
                        body: "{\"key\":\"value\"}",
                        path: "/api/resource",
                        query: {
                            search: ["test"]
                        },
                        raw_query: "search=test",
                        method: "GET",
                        content_length: 34
                    },
                    response: {
                        time: "2023-01-01T12:00:02Z",
                        body: "{\"result\":\"success\"}",
                        headers: {
                            "Content-Type": ["application/json"]
                        },
                        status: 200
                    }
                },
                meta: {
                    trace_id: "abc123"
                },
                links: {
                    self: "/logs/log123"
                }
            };

            const log = Log.hydrate(data, null);

            expect(log.id).toBe(data.id);
            expect(log.attributes.actor).toEqual(data.attributes.actor);
            expect(log.attributes.duration).toBe(data.attributes.duration);
            expect(log.attributes.request).toEqual(data.attributes.request);
            expect(log.attributes.response).toEqual(data.attributes.response);
            expect(log.meta).toEqual(data.meta);
            expect(log.links).toEqual(data.links);
        });

        it('should handle missing attributes gracefully', () => {
            const data = {
                id: "4c23484c-c99f-434d-a693-b8781ccdfe58",
                attributes: {},
                meta: {},
                links: {}
            };

            const log = Log.hydrate(data, null);

            expect(log.id).toBe(data.id);
            expect(log.attributes.actor).toEqual({ type: '', id: '' });
            expect(log.attributes.duration).toBe(0);
            expect(log.attributes.request).toEqual({
                time: '',
                headers: {},
                body: '',
                path: '',
                query: {},
                raw_query: '',
                method: '',
                content_length: 0
            });
            expect(log.attributes.response).toEqual({
                time: '',
                body: '',
                headers: {},
                status: 0
            });
            expect(log.meta).toEqual({});
            expect(log.links).toEqual({});
        });

        it('should return an instance with default values when no data is provided', () => {
            const log = Log.hydrate(null, null);

            expect(log.id).toBe('');
            expect(log.attributes.actor).toEqual({ type: '', id: '' });
            expect(log.attributes.duration).toBe(0);
            expect(log.attributes.request).toEqual({
                time: '',
                headers: {},
                body: '',
                path: '',
                query: {},
                raw_query: '',
                method: '',
                content_length: 0
            });
            expect(log.attributes.response).toEqual({
                time: '',
                body: '',
                headers: {},
                status: 0
            });
            expect(log.meta).toEqual({});
            expect(log.links).toEqual({});
        });
    });
});