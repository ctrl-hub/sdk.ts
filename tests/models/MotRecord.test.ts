import { describe, expect, test, beforeEach } from "bun:test";
import { MotRecord } from "@models/MotRecord";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('MotRecord Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newMotRecordData = {
        completedDate: '2023-10-15T10:00:00Z',
        dataSource: 'dvla',
        defects: [
            {
                dangerous: true,
                text: 'Brake fluid level below minimum',
                type: 'major'
            },
            {
                dangerous: false,
                text: 'Windscreen wiper damaged',
                type: 'minor'
            }
        ],
        expiryDate: '2024-10-15T10:00:00Z',
        odometer: {
            type: 'read',
            unit: 'miles',
            value: 45000
        },
        result: 'pass'
    };

    let newMotRecord;
    let serializer;

    beforeEach(() => {
        // Pass data properly to match the constructor's expected format
        newMotRecord = new MotRecord({
            attributes: {
                completed_date: newMotRecordData.completedDate,
                data_source: newMotRecordData.dataSource,
                defects: newMotRecordData.defects,
                expiry_date: newMotRecordData.expiryDate,
                odometer: newMotRecordData.odometer,
                result: newMotRecordData.result
            }
        });
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "vehicle-mot-records",
                attributes: {},
                relationships: {}
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newMotRecord.type).toBe('vehicle-mot-records');
        expect(newMotRecord.completedDate).toBe(newMotRecordData.completedDate);
        expect(newMotRecord.dataSource).toBe(newMotRecordData.dataSource);
        expect(newMotRecord.defects).toEqual(newMotRecordData.defects);
        expect(newMotRecord.expiryDate).toBe(newMotRecordData.expiryDate);
        expect(newMotRecord.odometer).toEqual(newMotRecordData.odometer);
        expect(newMotRecord.result).toBe(newMotRecordData.result);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newMotRecord);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newMotRecord.id = newId;
        const payload = serializer.buildUpdatePayload(newMotRecord);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                completed_date: '2023-11-20T14:00:00Z',
                data_source: 'mot',
                defects: [
                    {
                        dangerous: false,
                        text: 'Headlight alignment incorrect',
                        type: 'advisory'
                    }
                ],
                expiry_date: '2024-11-20T14:00:00Z',
                odometer: {
                    type: 'read',
                    unit: 'kilometers',
                    value: 72500
                },
                result: 'pass'
            }
        };

        const motRecord = new MotRecord(dataWithAttributes);

        expect(motRecord.completedDate).toBe(dataWithAttributes.attributes.completed_date);
        expect(motRecord.dataSource).toBe(dataWithAttributes.attributes.data_source);
        expect(motRecord.defects).toEqual(dataWithAttributes.attributes.defects);
        expect(motRecord.expiryDate).toBe(dataWithAttributes.attributes.expiry_date);
        expect(motRecord.odometer).toEqual(dataWithAttributes.attributes.odometer);
        expect(motRecord.result).toBe(dataWithAttributes.attributes.result);
    });

    test('should handle missing or empty data', () => {
        const emptyMotRecord = new MotRecord();

        expect(emptyMotRecord.type).toBe('vehicle-mot-records');
        expect(emptyMotRecord.completedDate).toBe('');
        expect(emptyMotRecord.dataSource).toBe('');
        expect(emptyMotRecord.defects).toEqual([]);
        expect(emptyMotRecord.expiryDate).toBe('');
        expect(emptyMotRecord.odometer).toEqual({
            type: 'read',
            unit: 'kilometers',
            value: 0
        });
        expect(emptyMotRecord.result).toBe('');
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newMotRecord.jsonApiMapping();
        expect(mapping).toEqual({});
    });

    test('should have correct static relationship definitions', () => {
        expect(MotRecord.relationships).toEqual([]);
    });
});