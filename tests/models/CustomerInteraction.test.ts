import { describe, expect, test, beforeEach } from "bun:test";
import { CustomerInteraction } from "@models/CustomerInteraction";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('CustomerInteraction Model', () => {
    const newId = 'a8cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newInteractionData = {
        method: 'email',
        direction: 'outbound',
        date_time: '2023-01-01T12:00:00Z',
        contacted: true,
        status: 'completed',
        notes: 'Customer was informed about upcoming maintenance'
    };

    let newInteraction;
    let serializer;

    beforeEach(() => {
        newInteraction = new CustomerInteraction(newInteractionData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "customer-interactions",
                attributes: {
                    method: newInteractionData.method,
                    direction: newInteractionData.direction,
                    date_time: newInteractionData.date_time,
                    contacted: newInteractionData.contacted,
                    status: newInteractionData.status,
                    notes: newInteractionData.notes
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
        expect(newInteraction.type).toBe('customer-interactions');
        expect(newInteraction.method).toBe(newInteractionData.method);
        expect(newInteraction.direction).toBe(newInteractionData.direction);
        expect(newInteraction.date_time).toBe(newInteractionData.date_time);
        expect(newInteraction.contacted).toBe(newInteractionData.contacted);
        expect(newInteraction.status).toBe(newInteractionData.status);
        expect(newInteraction.notes).toBe(newInteractionData.notes);
    });

    test('create payload should have correct attributes', () => {
        const payload = serializer.buildCreatePayload(newInteraction);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes', () => {
        newInteraction.id = newId;
        const payload = serializer.buildUpdatePayload(newInteraction);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                method: 'telephone',
                direction: 'inbound',
                date_time: '2023-02-15T14:30:00Z',
                contacted: true,
                status: 'in-progress',
                notes: 'Customer called with questions about billing'
            }
        };

        const interaction = new CustomerInteraction(dataWithAttributes);

        expect(interaction.method).toBe(dataWithAttributes.attributes.method);
        expect(interaction.direction).toBe(dataWithAttributes.attributes.direction);
        expect(interaction.date_time).toBe(dataWithAttributes.attributes.date_time);
        expect(interaction.contacted).toBe(dataWithAttributes.attributes.contacted);
        expect(interaction.status).toBe(dataWithAttributes.attributes.status);
        expect(interaction.notes).toBe(dataWithAttributes.attributes.notes);
    });

    test('should handle missing or empty data', () => {
        const emptyInteraction = new CustomerInteraction();

        expect(emptyInteraction.type).toBe('customer-interactions');
        expect(emptyInteraction.method).toBe('');
        expect(emptyInteraction.direction).toBe('');
        expect(emptyInteraction.date_time).toBe('');
        expect(emptyInteraction.contacted).toBe(false);
        expect(emptyInteraction.status).toBe('');
        expect(emptyInteraction.notes).toBe('');
    });

});