import { describe, expect, test, beforeEach } from "bun:test";
import { Organisation } from "@models/Organisation";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Organisation Model', () => {
    const newId = 'd2e89f0a-34b6-5c7d-ae4f-9g78h2i3j4k5';
    const newOrganisationData = {};

    let newOrganisation;
    let serializer;

    beforeEach(() => {
        newOrganisation = new Organisation(newOrganisationData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "organisations",
                attributes: {},
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct type', () => {
        expect(newOrganisation.type).toBe('organisations');
    });

    test('create payload should have correct structure', () => {
        const payload = serializer.buildCreatePayload(newOrganisation);
        verifyPayloadStructure(payload);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {}
        };

        const organisation = new Organisation(dataWithAttributes);
        expect(organisation.type).toBe('organisations');
    });

    test('should handle missing or empty data', () => {
        const emptyOrganisation = new Organisation();
        expect(emptyOrganisation.type).toBe('organisations');
    });
});