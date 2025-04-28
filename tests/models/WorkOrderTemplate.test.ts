import { describe, expect, test, beforeEach } from "bun:test";
import { WorkOrderTemplate } from "@models/WorkOrderTemplate";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('WorkOrderTemplate Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newWorkOrderTemplateData = {
        name: 'Maintenance Template',
        labels: ['routine', 'maintenance']
    };

    let newWorkOrderTemplate;
    let serializer;

    beforeEach(() => {
        newWorkOrderTemplate = new WorkOrderTemplate(newWorkOrderTemplateData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "work-order-templates",
                attributes: {
                    name: newWorkOrderTemplateData.name,
                    labels: newWorkOrderTemplateData.labels
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
        expect(newWorkOrderTemplate.type).toBe('work-order-templates');
        expect(newWorkOrderTemplate.name).toBe(newWorkOrderTemplateData.name);
        expect(newWorkOrderTemplate.labels).toEqual(newWorkOrderTemplateData.labels);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newWorkOrderTemplate);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newWorkOrderTemplate.id = newId;
        const payload = serializer.buildUpdatePayload(newWorkOrderTemplate);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Repair Template',
                labels: ['urgent', 'repair']
            }
        };

        const workOrderTemplate = new WorkOrderTemplate(dataWithAttributes);

        expect(workOrderTemplate.name).toBe(dataWithAttributes.attributes.name);
        expect(workOrderTemplate.labels).toEqual(dataWithAttributes.attributes.labels);
    });

    test('should handle missing or empty data', () => {
        const emptyWorkOrderTemplate = new WorkOrderTemplate();

        expect(emptyWorkOrderTemplate.type).toBe('work-order-templates');
        expect(emptyWorkOrderTemplate.name).toBe('');
        expect(emptyWorkOrderTemplate.labels).toEqual([]);
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newWorkOrderTemplate.jsonApiMapping();

        expect(mapping.attributes).toContain('name');
        expect(mapping.attributes).toContain('labels');
    });

    test('should have correct static relationship definitions', () => {
        expect(WorkOrderTemplate.relationships).toEqual([]);
    });
});