import { describe, expect, test, beforeEach } from "bun:test";
import { Operation } from "@models/Operation";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Operation Model', () => {
    const newId = 'd9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newOperationData = {
        name: 'Field Maintenance Operation',
        code: 'FM-2023-001',
        description: 'Scheduled field maintenance for Q4 2023',
        start_date: '2023-10-01T00:00:00Z',
        end_date: '2023-12-31T23:59:59Z',
        labels: [
            { key: 'priority', value: 'high' },
            { key: 'region', value: 'north' }
        ],
        uprns: ['1234567890', '9876543210'],
        usrns: ['USRN001', 'USRN002'],
        completed: false,
        aborted: false,
        cancelled: false
    };

    let newOperation;
    let serializer;

    beforeEach(() => {
        newOperation = new Operation(newOperationData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "operations",
                attributes: {
                    name: newOperationData.name,
                    code: newOperationData.code,
                    description: newOperationData.description,
                    start_date: newOperationData.start_date,
                    end_date: newOperationData.end_date,
                    labels: newOperationData.labels,
                    uprns: newOperationData.uprns,
                    usrns: newOperationData.usrns,
                    completed: newOperationData.completed,
                    aborted: newOperationData.aborted,
                    cancelled: newOperationData.cancelled
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
        expect(newOperation.type).toBe('operations');
        expect(newOperation.name).toBe(newOperationData.name);
        expect(newOperation.code).toBe(newOperationData.code);
        expect(newOperation.description).toBe(newOperationData.description);
        expect(newOperation.start_date).toBe(newOperationData.start_date);
        expect(newOperation.end_date).toBe(newOperationData.end_date);
        expect(newOperation.labels).toEqual(newOperationData.labels);
        expect(newOperation.uprns).toEqual(newOperationData.uprns);
        expect(newOperation.usrns).toEqual(newOperationData.usrns);
        expect(newOperation.completed).toBe(newOperationData.completed);
        expect(newOperation.aborted).toBe(newOperationData.aborted);
        expect(newOperation.cancelled).toBe(newOperationData.cancelled);
    });

    test('create payload should have correct attributes', () => {
        const payload = serializer.buildCreatePayload(newOperation);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes', () => {
        newOperation.id = newId;
        const payload = serializer.buildUpdatePayload(newOperation);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Emergency Response',
                code: 'ER-2023-005',
                description: 'Response to reported infrastructure issue',
                start_date: '2023-11-15T08:00:00Z',
                end_date: '2023-11-16T18:00:00Z',
                labels: [
                    { key: 'priority', value: 'urgent' },
                    { key: 'type', value: 'emergency' }
                ],
                uprns: ['5678901234'],
                usrns: ['USRN003'],
                completed: true,
                aborted: false,
                cancelled: false
            }
        };

        const operation = new Operation(dataWithAttributes);

        expect(operation.name).toBe(dataWithAttributes.attributes.name);
        expect(operation.code).toBe(dataWithAttributes.attributes.code);
        expect(operation.description).toBe(dataWithAttributes.attributes.description);
        expect(operation.start_date).toBe(dataWithAttributes.attributes.start_date);
        expect(operation.end_date).toBe(dataWithAttributes.attributes.end_date);
        expect(operation.labels).toEqual(dataWithAttributes.attributes.labels);
        expect(operation.uprns).toEqual(dataWithAttributes.attributes.uprns);
        expect(operation.usrns).toEqual(dataWithAttributes.attributes.usrns);
        expect(operation.completed).toBe(dataWithAttributes.attributes.completed);
        expect(operation.aborted).toBe(dataWithAttributes.attributes.aborted);
        expect(operation.cancelled).toBe(dataWithAttributes.attributes.cancelled);
    });

    test('should handle missing or empty data', () => {
        const emptyOperation = new Operation();

        expect(emptyOperation.type).toBe('operations');
        expect(emptyOperation.name).toBe('');
        expect(emptyOperation.code).toBe('');
        expect(emptyOperation.description).toBe('');
        expect(emptyOperation.start_date).toBe('');
        expect(emptyOperation.end_date).toBe('');
        expect(emptyOperation.labels).toEqual([]);
        expect(emptyOperation.uprns).toEqual([]);
        expect(emptyOperation.usrns).toEqual([]);
        expect(emptyOperation.completed).toBe(false);
        expect(emptyOperation.aborted).toBe(false);
        expect(emptyOperation.cancelled).toBe(false);
    });

});