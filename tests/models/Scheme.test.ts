import { describe, expect, test, beforeEach } from "bun:test";
import { Scheme } from "@models/Scheme";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Scheme Model', () => {
    const newId = 'g5h6i7j8-9k0l-1m2n-3o4p-q5r6s7t8u9v0';
    const newSchemeData = {
        attributes: {
            name: 'Annual Maintenance Program',
            code: 'AMP-2023',
            description: 'Comprehensive maintenance program for 2023',
            anticipated_start_date: '2023-01-01',
            anticipated_end_date: '2023-12-31',
            labels: [{ name: 'maintenance', color: '#00FF00' }, { name: 'annual', color: '#0000FF' }]
        }
    };

    let newScheme;
    let serializer;

    beforeEach(() => {
        newScheme = new Scheme(newSchemeData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "schemes",
                attributes: {
                    name: newSchemeData.attributes.name,
                    code: newSchemeData.attributes.code,
                    description: newSchemeData.attributes.description,
                    anticipated_start_date: newSchemeData.attributes.anticipated_start_date,
                    anticipated_end_date: newSchemeData.attributes.anticipated_end_date,
                    labels: newSchemeData.attributes.labels
                },
                relationships: {}
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newScheme.type).toBe('schemes');
        expect(newScheme.name).toBe(newSchemeData.attributes.name);
        expect(newScheme.code).toBe(newSchemeData.attributes.code);
        expect(newScheme.description).toBe(newSchemeData.attributes.description);
        expect(newScheme.anticipated_start_date).toBe(newSchemeData.attributes.anticipated_start_date);
        expect(newScheme.anticipated_end_date).toBe(newSchemeData.attributes.anticipated_end_date);
        expect(newScheme.labels).toEqual(newSchemeData.attributes.labels);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newScheme);
        verifyPayloadStructure(payload);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Emergency Response Plan',
                code: 'ERP-2023',
                description: 'Plan for emergency situations',
                anticipated_start_date: '2023-06-01',
                anticipated_end_date: '2023-12-31',
                labels: [{ name: 'emergency', color: '#FF0000' }]
            }
        };

        const scheme = new Scheme(dataWithAttributes);

        expect(scheme.name).toBe(dataWithAttributes.attributes.name);
        expect(scheme.code).toBe(dataWithAttributes.attributes.code);
        expect(scheme.description).toBe(dataWithAttributes.attributes.description);
        expect(scheme.anticipated_start_date).toBe(dataWithAttributes.attributes.anticipated_start_date);
        expect(scheme.anticipated_end_date).toBe(dataWithAttributes.attributes.anticipated_end_date);
        expect(scheme.labels).toEqual(dataWithAttributes.attributes.labels);
    });

    test('should handle missing or empty data', () => {
        const emptyScheme = new Scheme();

        expect(emptyScheme.type).toBe('schemes');
        expect(emptyScheme.name).toBe('');
        expect(emptyScheme.code).toBe('');
        expect(emptyScheme.description).toBe('');
        expect(emptyScheme.anticipated_start_date).toBe('');
        expect(emptyScheme.anticipated_end_date).toBe('');
        expect(emptyScheme.labels).toEqual([]);
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newScheme.jsonApiMapping();

        expect(mapping.attributes).toContain('name');
        expect(mapping.attributes).toContain('code');
        expect(mapping.attributes).toContain('description');
        expect(mapping.attributes).toContain('anticipated_start_date');
        expect(mapping.attributes).toContain('anticipated_end_date');
        expect(mapping.attributes).toContain('labels');
    });

    test('should have correct static relationship definitions', () => {
        expect(Scheme.relationships).toEqual([
            {
                name: 'work_orders',
                type: 'array',
                modelType: 'work-orders',
            },
            {
                name: 'template',
                type: 'single',
                modelType: 'scheme-templates',
            }
        ]);
    });
});