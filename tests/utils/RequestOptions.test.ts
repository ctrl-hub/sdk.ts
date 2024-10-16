import { describe, it, expect } from "bun:test";
import { RequestOptions, RequestOptionsType } from "@utils/RequestOptions";

describe('RequestOptions', () => {

    it('should initialize with sort, limit, and offset values', () => {
        const options: RequestOptionsType = new RequestOptions({
            sort: [{ key: 'name', direction: 'asc' }, { key: 'age', direction: 'desc' }],
            limit: 10,
            offset: 20,
            filters: [{ key: 'categories.id', value: 'b60e2af5-6a84-0eb0-feaa-84384a94' }]
        });

        const requestOptions = new RequestOptions(options);

        expect(requestOptions.sort).toEqual(options.sort);
        expect(requestOptions.limit).toBe(10);
        expect(requestOptions.offset).toBe(20);
        expect(requestOptions.filters).toEqual(options.filters);
    });

    it('should convert sort, limit, and offset to URLSearchParams', () => {
        const options: RequestOptionsType = {
            sort: [{ key: 'name', direction: 'asc' }, { key: 'age', direction: 'desc' }],
            limit: 10,
            offset: 20,
            filters: [{ key: 'categories.id', value: 'b60e2af5-6a84-0eb0-feaa-84384a94' }],
        };

        const requestOptions = new RequestOptions(options);
        const params = requestOptions.toURLSearchParams();

        expect(params.get('sort')).toBe('name,-age');
        expect(params.get('limit')).toBe('10');
        expect(params.get('offset')).toBe('20');
        expect(params.get('filter[categories.id]')).toBe('b60e2af5-6a84-0eb0-feaa-84384a94');
    });

    it('should handle missing sort, limit, and offset gracefully', () => {
        const options: RequestOptionsType = {};
        const requestOptions = new RequestOptions(options);
        const params = requestOptions.toURLSearchParams();

        expect(params.get('sort')).toBeNull();
        expect(params.get('limit')).toBeNull();
        expect(params.get('offset')).toBeNull();
        expect(params.get('filter[categories.id]')).toBeNull();
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

    describe('fromUrl', () => {
        it('should parse URL with multiple filters and sort', () => {
            const url = 'https://app.ctrl-hub.run/organisations/ctrl-hub/data-capture/forms?filter[categories.id]=1234&filter[status]=active&sort=-name&limit=15&offset=5';

            const result = RequestOptions.fromUrl(url);

            expect(result.filters).toEqual([
                { key: 'categories.id', value: '1234' },
                { key: 'status', value: 'active' },
            ]);
            expect(result.sort).toEqual([{ key: 'name', direction: 'desc' }]);
            expect(result.limit).toBe(15);
            expect(result.offset).toBe(5);
        });

        it('should apply default values when not present in the URL', () => {
            const url = 'https://app.ctrl-hub.run/organisations/ctrl-hub/data-capture/forms';
            const defaults: Partial<RequestOptionsType> = {
                limit: 30,
                offset: 10,
                filters: [{ key: 'status', value: 'published' }],
                sort: [{ key: 'created_at', direction: 'asc' }],
            };

            const result = RequestOptions.fromUrl(url, defaults);

            expect(result.filters).toEqual([{ key: 'status', value: 'published' }]);
            expect(result.sort).toEqual([{ key: 'created_at', direction: 'asc' }]);
            expect(result.limit).toBe(30);
            expect(result.offset).toBe(10);
        });

        it('should override defaults when URL params are present', () => {
            const url = 'https://app.ctrl-hub.run/organisations/ctrl-hub/data-capture/forms?filter[status]=draft&limit=5&offset=0';
            const defaults: Partial<RequestOptionsType> = {
                limit: 50,
                offset: 20,
                filters: [{ key: 'status', value: 'published' }],
                sort: [{ key: 'created_at', direction: 'asc' }],
            };

            const result = RequestOptions.fromUrl(url, defaults);

            expect(result.filters).toEqual([{ key: 'status', value: 'draft' }]);
            expect(result.limit).toBe(5);
            expect(result.offset).toBe(0);
            expect(result.sort).toEqual([{ key: 'created_at', direction: 'asc' }]);
        });

        it('should handle URL without filters or sort and apply defaults', () => {
            const url = 'https://app.ctrl-hub.run/organisations/ctrl-hub/data-capture/forms?limit=10&offset=0';
            const defaults: Partial<RequestOptionsType> = {
                filters: [{ key: 'status', value: 'published' }],
                sort: [{ key: 'created_at', direction: 'asc' }],
            };

            const result = RequestOptions.fromUrl(url, defaults);

            expect(result.filters).toEqual([{ key: 'status', value: 'published' }]);
            expect(result.sort).toEqual([{ key: 'created_at', direction: 'asc' }]);
            expect(result.limit).toBe(10);
            expect(result.offset).toBe(0);
        });
    });

    describe('toURLSearchParams', () => {
        it('should convert RequestOptions to URLSearchParams', () => {
            const requestOptions = new RequestOptions({
                limit: 25,
                offset: 5,
                filters: [
                    { key: 'categories.id', value: '1234' },
                    { key: 'status', value: 'active' },
                ],
                sort: [{ key: 'name', direction: 'asc' }],
            });

            const params = requestOptions.toURLSearchParams();
            expect(params.get('limit')).toBe('25');
            expect(params.get('offset')).toBe('5');
            expect(params.get('sort')).toBe('name');
            expect(params.get('filter[categories.id]')).toBe('1234');
            expect(params.get('filter[status]')).toBe('active');
        });

        it('should handle descending sort correctly in URLSearchParams', () => {
            const requestOptions = new RequestOptions({
                sort: [{ key: 'created_at', direction: 'desc' }]
            });

            const params = requestOptions.toURLSearchParams();
            expect(params.get('sort')).toBe('-created_at');
        });

    });
});