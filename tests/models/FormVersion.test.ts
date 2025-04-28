import { describe, expect, test, beforeEach } from "bun:test";
import { FormVersion } from "@models/FormVersion";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('FormVersion Model', () => {
    const newId = 'h6i7j8k9-l0m1-n2o3-p4q5-r6s7t8u9v0w1';
    const newFormVersionData = {
        attributes: {
            name: 'Safety Inspection Form v2.1'
        }
    };

    let newFormVersion;
    let serializer;

    beforeEach(() => {
        newFormVersion = new FormVersion(newFormVersionData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "form-version",
                attributes: {
                    name: newFormVersionData.attributes.name
                },
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newFormVersion.type).toBe('form-version');
        expect(newFormVersion.name).toBe(newFormVersionData.attributes.name);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newFormVersion);
        verifyPayloadStructure(payload);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                name: 'Risk Assessment Form v1.3'
            }
        };

        const formVersion = new FormVersion(dataWithAttributes);
        expect(formVersion.name).toBe(dataWithAttributes.attributes.name);
    });

    test('should handle missing or empty data', () => {
        const emptyFormVersion = new FormVersion();

        expect(emptyFormVersion.type).toBe('form-version');
        expect(emptyFormVersion.name).toBe('');
    });
});