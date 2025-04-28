import { describe, expect, test, beforeEach } from "bun:test";
import { SchemeTemplate } from "@models/SchemeTemplate";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('SchemeTemplate Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newSchemeTemplateData = {
        name: 'Residential Scheme Template',
        labels: ['residential', 'standard']
    };

    let newSchemeTemplate;
    let serializer;

    beforeEach(() => {
        newSchemeTemplate = new SchemeTemplate(newSchemeTemplateData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "scheme-templates",
                attributes: {
                    name: newSchemeTemplateData.name,
                    labels: newSchemeTemplateData.labels
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
        expect(newSchemeTemplate.type).toBe('scheme-templates');
        expect(newSchemeTemplate.name).toBe(newSchemeTemplateData.name);
        expect(newSchemeTemplate.labels).toEqual(newSchemeTemplateData.labels);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newSchemeTemplate);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newSchemeTemplate.id = newId;
        const payload = serializer.buildUpdatePayload(newSchemeTemplate);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Commercial Scheme Template',
                labels: ['commercial', 'premium']
            }
        };

        const schemeTemplate = new SchemeTemplate(dataWithAttributes);

        expect(schemeTemplate.name).toBe(dataWithAttributes.attributes.name);
        expect(schemeTemplate.labels).toEqual(dataWithAttributes.attributes.labels);
    });

    test('should handle missing or empty data', () => {
        const emptySchemeTemplate = new SchemeTemplate();

        expect(emptySchemeTemplate.type).toBe('scheme-templates');
        expect(emptySchemeTemplate.name).toBe('');
        expect(emptySchemeTemplate.labels).toEqual([]);
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newSchemeTemplate.jsonApiMapping();

        expect(mapping.attributes).toContain('name');
        expect(mapping.attributes).toContain('labels');
    });

    test('should have correct static relationship definitions', () => {
        expect(SchemeTemplate.relationships).toEqual([]);
    });
});