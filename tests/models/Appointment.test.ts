import { describe, expect, test, beforeEach } from "bun:test";
import { Appointment } from "@models/Appointment";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Appointment Model', () => {
    const newId = 'b9cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newAppointmentData = {
        start_time: '2023-10-15T10:00:00Z',
        end_time: '2023-10-15T11:00:00Z',
        notes: 'Annual maintenance check',
        customer_interaction: 'c68a5f32-b9a1-4dab-8f11-7ec2f6b89001',
        operation: 'd92c4f18-7a32-4e7c-9f26-8c03e1bca7e3'
    };

    let newAppointment;
    let serializer;

    beforeEach(() => {
        newAppointment = new Appointment(newAppointmentData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "appointments",
                attributes: {
                    start_time: newAppointmentData.start_time,
                    end_time: newAppointmentData.end_time,
                    notes: newAppointmentData.notes
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
        expect(newAppointment.type).toBe('appointments');
        expect(newAppointment.start_time).toBe(newAppointmentData.start_time);
        expect(newAppointment.end_time).toBe(newAppointmentData.end_time);
        expect(newAppointment.notes).toBe(newAppointmentData.notes);
    });

    test('create payload should have correct attributes and relationships', () => {
        const payload = serializer.buildCreatePayload(newAppointment);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes and relationships', () => {
        newAppointment.id = newId;
        const payload = serializer.buildUpdatePayload(newAppointment);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                start_time: '2023-11-20T14:00:00Z',
                end_time: '2023-11-20T15:00:00Z',
                notes: 'Follow-up appointment'
            },
            relationships: {
                customer_interaction: { data: { id: 'e12f3456-7890-abcd-ef12-123456789012', type: 'customer-interactions' } },
                operation: { data: { id: 'f23e4567-8901-bcde-f123-234567890123', type: 'operations' } }
            }
        };

        const appointment = new Appointment(dataWithAttributes);

        expect(appointment.start_time).toBe(dataWithAttributes.attributes.start_time);
        expect(appointment.end_time).toBe(dataWithAttributes.attributes.end_time);
        expect(appointment.notes).toBe(dataWithAttributes.attributes.notes);
    });

    test('should handle missing or empty data', () => {
        const emptyAppointment = new Appointment();

        expect(emptyAppointment.type).toBe('appointments');
        expect(emptyAppointment.start_time).toBe('');
        expect(emptyAppointment.end_time).toBe('');
        expect(emptyAppointment.notes).toBe('');
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newAppointment.jsonApiMapping();

        expect(mapping.attributes).toContain('start_time');
        expect(mapping.attributes).toContain('end_time');
        expect(mapping.attributes).toContain('notes');
        expect(mapping.relationships.customer_interaction).toBe('customer-interactions');
        expect(mapping.relationships.operation).toBe('operations');
    });

    test('should have correct static relationship definitions', () => {
        expect(Appointment.relationships).toEqual([
            {
                name: 'customer_interaction',
                type: 'single',
                modelType: 'customer-interactions',
            },
            {
                name: 'operation',
                type: 'single',
                modelType: 'operations',
            },
        ]);
    });
});