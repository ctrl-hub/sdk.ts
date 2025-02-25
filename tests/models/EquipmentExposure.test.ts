import { describe, expect, test, beforeEach } from "bun:test";
import { EquipmentExposure } from "@models/EquipmentExposure";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('EquipmentExposure Model', () => {
    const newId = 'c8dbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newExposureData = {
        location: {
            type: "Point",
            coordinates: [51.5074, -0.1278]
        },
        ppe: {
            mask: true,
            ear_defenders: false
        }
    };

    let newExposure;
    let serializer;

    beforeEach(() => {
        newExposure = new EquipmentExposure(newExposureData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "equipment-exposures",
                attributes: {
                    location: newExposureData.location,
                    ppe: newExposureData.ppe
                },
                relationships: {},
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newExposure.type).toBe('equipment-exposures');
        expect(newExposure.location).toEqual(newExposureData.location);
        expect(newExposure.ppe).toEqual(newExposureData.ppe);
    });

    test('create payload should have correct attributes', () => {
        const payload = serializer.buildCreatePayload(newExposure);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes', () => {
        newExposure.id = newId;
        const payload = serializer.buildUpdatePayload(newExposure);
        verifyPayloadStructure(payload, true);
    });
});
