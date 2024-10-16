import { describe, it, expect, mock } from "bun:test";
import { Requests } from "@utils/Requests";
import { RequestOptions } from "@utils/RequestOptions";

describe('Requests', () => {
    describe('buildRequestURL', () => {
        it('should append URLSearchParams when param is RequestOptions', () => {
            const requestOptions = new RequestOptions({
                sort: [{ key: "name", direction: "asc" }],
                limit: 10,
                offset: 20,
            });

            const result = Requests.buildRequestURL('/test-endpoint', requestOptions);

            expect(result).toBe('/test-endpoint?sort=name&limit=10&offset=20');
        });

        it('should append param as a path when param is a string', () => {
            const result = Requests.buildRequestURL('/test-endpoint', '123');

            expect(result).toBe('/test-endpoint/123');
        });

        it('should return the base endpoint when param is null or undefined', () => {
            const resultWithNull = Requests.buildRequestURL("/test-endpoint", null);
            const resultWithUndefined = Requests.buildRequestURL("/test-endpoint", undefined);

            expect(resultWithNull).toBe("/test-endpoint");
            expect(resultWithUndefined).toBe("/test-endpoint");
        });
    });

    describe('buildInternalResponse', () => {
        it('should correctly build an internal response from a fetch response', () => {
            const mockFetchResponse = {
                ok: true,
                status: 200,
                headers: {
                    get: mock(() => 'application/json'),
                },
            };
            const mockJson = {
                meta: { totalCount: 100 },
                links: { self: '/test' },
                data: [{ id: '61d09b64-801c-4eff-9f76-ba1283e77cc7', type: 'test-type', attributes: {} }],
                included: [{ id: 'fbe037e8-e690-4ada-aa23-89c8f150cf24', type: 'related-type', attributes: {} }],
                errors: [],
            };

            const result = Requests.buildInternalResponse(mockFetchResponse, mockJson);

            expect(result.ok).toBe(true);
            expect(result.statusCode).toBe(200);
            expect(result.headers).toBe(mockFetchResponse.headers);
            expect(result.meta).toEqual(mockJson.meta);
            expect(result.links).toEqual(mockJson.links);
            expect(result.data).toEqual(mockJson.data);
            expect(result.included).toEqual(mockJson.included);
            expect(result.errors.api).toEqual([]);
        });

        it('should handle missing or null JSON fields gracefully', () => {
            const mockFetchResponse = {
                ok: false,
                status: 404,
                headers: {},
            };
            const mockJson = {};

            const result = Requests.buildInternalResponse(mockFetchResponse, mockJson);

            expect(result.ok).toBe(false);
            expect(result.statusCode).toBe(404);
            expect(result.meta).toBeNull();
            expect(result.links).toBeNull();
            expect(result.data).toBeNull();
            expect(result.included).toBeNull();
            expect(result.errors.api).toEqual([]);
        });
    });

    describe('buildInternalErrorResponse', () => {
        it('should correctly build an internal error response from an error object', () => {
            const mockError = {
                message: "Network error",
                statusCode: 0,
                headers: {},
            };

            const result = Requests.buildInternalErrorResponse(mockError);

            expect(result.ok).toBe(false);
            expect(result.statusCode).toBe(0);
            expect(result.headers).toBe(mockError.headers);
            expect(result.errors.network).toEqual([mockError]);
            expect(result.data).toBeNull();
        });

        it('should handle errors without a statusCode', () => {
            const mockError = {
                message: "Some error",
                headers: {},
            };

            const result = Requests.buildInternalErrorResponse(mockError);

            expect(result.statusCode).toBe(0); // Fallback to 0 if statusCode isn't present
        });
    });
});