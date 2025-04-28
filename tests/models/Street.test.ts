import { describe, expect, test, beforeEach } from "bun:test";
import { Street } from "@models/Street";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Street Model', () => {
    const newId = 'i7j8k9l0-m1n2-o3p4-q5r6-s7t8u9v0w1x2';
    const newStreetData = {
        attributes: {
            usrn: 12345678,
            location: {
                type: 'Point',
                coordinates: [-0.1278, 51.5074]
            }
        }
    };

    let newStreet;
    let serializer;

    beforeEach(() => {
        newStreet = new Street(newStreetData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "streets",
                attributes: {
                    usrn: newStreetData.attributes.usrn,
                    location: newStreetData.attributes.location
                },
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newStreet.type).toBe('streets');
        expect(newStreet.usrn).toBe(newStreetData.attributes.usrn);
        expect(newStreet.location).toEqual(newStreetData.attributes.location);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newStreet);
        verifyPayloadStructure(payload);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                usrn: 87654321,
                location: {
                    type: 'LineString',
                    coordinates: [[-0.1280, 51.5076], [-0.1275, 51.5070]]
                }
            }
        };

        const street = new Street(dataWithAttributes);
        expect(street.usrn).toBe(dataWithAttributes.attributes.usrn);
        expect(street.location).toEqual(dataWithAttributes.attributes.location);
    });

    test('should handle data without attributes wrapper', () => {
        const dataWithoutWrapper = {
            usrn: 55555555,
            location: {
                type: 'Point',
                coordinates: [-0.1290, 51.5080]
            }
        };

        const street = new Street(dataWithoutWrapper);
        expect(street.usrn).toBe(dataWithoutWrapper.usrn);
        expect(street.location).toEqual(dataWithoutWrapper.location);
    });
});