import { describe, expect, test, beforeEach } from "bun:test";
import { WorkOrder } from "@models/WorkOrder";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('WorkOrder Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newWorkOrderData = {
        name: 'Maintenance Work Order',
        code: 'WO-2023-001',
        description: 'Annual equipment maintenance',
        anticipated_start_date: '2023-10-15T10:00:00Z',
        anticipated_end_date: '2023-10-20T17:00:00Z',
        labels: ['urgent', 'maintenance'],
        operations: ['d92c4f18-7a32-4e7c-9f26-8c03e1bca7e3'],
        template: 'c68a5f32-b9a1-4dab-8f11-7ec2f6b89001'
    };

    let newWorkOrder;
    let serializer;

    beforeEach(() => {
        newWorkOrder = new WorkOrder(newWorkOrderData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "work-orders",
                attributes: {
                    name: newWorkOrderData.name,
                    code: newWorkOrderData.code,
                    description: newWorkOrderData.description,
                    anticipated_start_date: newWorkOrderData.anticipated_start_date,
                    anticipated_end_date: newWorkOrderData.anticipated_end_date,
                    labels: newWorkOrderData.labels
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
        expect(newWorkOrder.type).toBe('work-orders');
        expect(newWorkOrder.name).toBe(newWorkOrderData.name);
        expect(newWorkOrder.code).toBe(newWorkOrderData.code);
        expect(newWorkOrder.description).toBe(newWorkOrderData.description);
        expect(newWorkOrder.anticipated_start_date).toBe(newWorkOrderData.anticipated_start_date);
        expect(newWorkOrder.anticipated_end_date).toBe(newWorkOrderData.anticipated_end_date);
        expect(newWorkOrder.labels).toEqual(newWorkOrderData.labels);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newWorkOrder);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newWorkOrder.id = newId;
        const payload = serializer.buildUpdatePayload(newWorkOrder);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Repair Work Order',
                code: 'WO-2023-002',
                description: 'Emergency repair',
                anticipated_start_date: '2023-11-20T14:00:00Z',
                anticipated_end_date: '2023-11-21T15:00:00Z',
                labels: ['critical', 'repair']
            },
            relationships: {
                operations: { data: [{ id: 'e12f3456-7890-abcd-ef12-123456789012', type: 'operations' }] },
                template: { data: { id: 'f23e4567-8901-bcde-f123-234567890123', type: 'work-order-templates' } }
            }
        };

        const workOrder = new WorkOrder(dataWithAttributes);

        expect(workOrder.name).toBe(dataWithAttributes.attributes.name);
        expect(workOrder.code).toBe(dataWithAttributes.attributes.code);
        expect(workOrder.description).toBe(dataWithAttributes.attributes.description);
        expect(workOrder.anticipated_start_date).toBe(dataWithAttributes.attributes.anticipated_start_date);
        expect(workOrder.anticipated_end_date).toBe(dataWithAttributes.attributes.anticipated_end_date);
        expect(workOrder.labels).toEqual(dataWithAttributes.attributes.labels);
    });

    test('should handle missing or empty data', () => {
        const emptyWorkOrder = new WorkOrder();

        expect(emptyWorkOrder.type).toBe('work-orders');
        expect(emptyWorkOrder.name).toBe('');
        expect(emptyWorkOrder.code).toBe('');
        expect(emptyWorkOrder.description).toBe('');
        expect(emptyWorkOrder.anticipated_start_date).toBe('');
        expect(emptyWorkOrder.anticipated_end_date).toBe('');
        expect(emptyWorkOrder.labels).toEqual([]);
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newWorkOrder.jsonApiMapping();

        expect(mapping.attributes).toContain('name');
        expect(mapping.attributes).toContain('code');
        expect(mapping.attributes).toContain('description');
        expect(mapping.attributes).toContain('anticipated_start_date');
        expect(mapping.attributes).toContain('anticipated_end_date');
        expect(mapping.attributes).toContain('labels');
    });

    test('should have correct static relationship definitions', () => {
        expect(WorkOrder.relationships).toEqual([
            {
                name: 'operations',
                type: 'array',
                modelType: 'operations',
            },
            {
                name: 'template',
                type: 'single',
                modelType: 'work-order-templates',
            },
        ]);
    });
});