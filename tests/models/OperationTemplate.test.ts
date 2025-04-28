import { describe, expect, test, beforeEach } from "bun:test";
import { OperationTemplate } from "@models/OperationTemplate";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('OperationTemplate Model', () => {
    const newId = 'c1d78e9f-23a5-4b6c-9d3e-8f67a1b2c3d4';
    const newOperationTemplateData = {
        name: 'Standard Maintenance Procedure',
        labels: ['maintenance', 'standard'],
        requirements: {
            forms: [
                { id: 'form-123', required: true },
                { id: 'form-456', required: false }
            ]
        }
    };

    let newOperationTemplate;
    let serializer;

    beforeEach(() => {
        newOperationTemplate = new OperationTemplate(newOperationTemplateData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "operation-templates",
                attributes: {
                    name: newOperationTemplateData.name,
                    labels: newOperationTemplateData.labels,
                    requirements: newOperationTemplateData.requirements
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
        expect(newOperationTemplate.type).toBe('operation-templates');
        expect(newOperationTemplate.name).toBe(newOperationTemplateData.name);
        expect(newOperationTemplate.labels).toEqual(newOperationTemplateData.labels);
        expect(newOperationTemplate.requirements).toEqual(newOperationTemplateData.requirements);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newOperationTemplate);
        verifyPayloadStructure(payload);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Emergency Response Template',
                labels: ['emergency', 'urgent'],
                requirements: {
                    forms: [
                        { id: 'form-789', required: true }
                    ]
                }
            }
        };

        const operationTemplate = new OperationTemplate(dataWithAttributes);

        expect(operationTemplate.name).toBe(dataWithAttributes.attributes.name);
        expect(operationTemplate.labels).toEqual(dataWithAttributes.attributes.labels);
        expect(operationTemplate.requirements).toEqual(dataWithAttributes.attributes.requirements);
    });

    test('should handle missing or empty data', () => {
        const emptyOperationTemplate = new OperationTemplate();

        expect(emptyOperationTemplate.type).toBe('operation-templates');
        expect(emptyOperationTemplate.name).toBe('');
        expect(emptyOperationTemplate.labels).toEqual([]);
        expect(emptyOperationTemplate.requirements).toEqual({ forms: [] });
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newOperationTemplate.jsonApiMapping();

        expect(mapping.attributes).toContain('name');
        expect(mapping.attributes).toContain('labels');
        expect(mapping.attributes).toContain('requirements');
    });
});