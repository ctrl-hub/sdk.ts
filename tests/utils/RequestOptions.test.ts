import { describe, it, expect } from "bun:test";
import { RequestOptions, RequestOptionsType } from "utils/RequestOptions";

describe('RequestOptions', () => {

    it('should initialize with sort, limit, and offset values', () => {
        const options: RequestOptionsType = {
            sort: [{ key: 'name', direction: 'asc' }, { key: 'age', direction: 'desc' }],
            limit: 10,
            offset: 20
        };

        const requestOptions = new RequestOptions(options);

        expect(requestOptions.sort).toEqual(options.sort);
        expect(requestOptions.limit).toBe(10);
        expect(requestOptions.offset).toBe(20);
    });

    it('should convert sort, limit, and offset to URLSearchParams', () => {
        const options: RequestOptionsType = {
            sort: [{ key: 'name', direction: 'asc' }, { key: 'age', direction: 'desc' }],
            limit: 10,
            offset: 20
        };

        const requestOptions = new RequestOptions(options);
        const params = requestOptions.toURLSearchParams();

        expect(params.get('sort')).toBe('name,-age');
        expect(params.get('limit')).toBe('10');
        expect(params.get('offset')).toBe('20');
    });

    it('should handle missing sort, limit, and offset gracefully', () => {
        const options: RequestOptionsType = {};
        const requestOptions = new RequestOptions(options);
        const params = requestOptions.toURLSearchParams();

        expect(params.get('sort')).toBeNull();
        expect(params.get('limit')).toBeNull();
        expect(params.get('offset')).toBeNull();
    });

    it('should handle sort with missing direction (default to asc)', () => {
        const options: RequestOptionsType = {
            sort: [{ key: 'name' }]
        };

        const requestOptions = new RequestOptions(options);
        const params = requestOptions.toURLSearchParams();

        expect(params.get('sort')).toBe('name');
    });

    it('should handle multiple sort keys with mixed directions', () => {
        const options: RequestOptionsType = {
            sort: [
                { key: "name", direction: "asc" },
                { key: "slug", direction: "desc" },
                { key: "createdAt" }
            ]
        };

        const requestOptions = new RequestOptions(options);
        const params = requestOptions.toURLSearchParams();

        expect(params.get('sort')).toBe('name,-slug,createdAt');
    });
});