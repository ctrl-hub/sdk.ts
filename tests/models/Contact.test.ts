import { describe, expect, test, beforeEach } from "bun:test";
import { Contact } from "@models/Contact";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('Contact Model', () => {
    const newId = 'a8cbbac7-65aa-40d1-aed8-f68b71aa6b6e';
    const newContactData = {
        salutation: 'Mr',
        first_name: 'John',
        last_name: 'Smith',
        telephone: '07700900123',
        email: 'john.smith@example.com'
    };

    let newContact;
    let serializer;

    beforeEach(() => {
        newContact = new Contact(newContactData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                type: "contacts",
                attributes: {
                    salutation: newContactData.salutation,
                    first_name: newContactData.first_name,
                    last_name: newContactData.last_name,
                    telephone: newContactData.telephone,
                    email: newContactData.email
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
        expect(newContact.type).toBe('contacts');
        expect(newContact.salutation).toBe(newContactData.salutation);
        expect(newContact.first_name).toBe(newContactData.first_name);
        expect(newContact.last_name).toBe(newContactData.last_name);
        expect(newContact.telephone).toBe(newContactData.telephone);
        expect(newContact.email).toBe(newContactData.email);
    });

    test('create payload should have correct attributes', () => {
        const payload = serializer.buildCreatePayload(newContact);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes', () => {
        newContact.id = newId;
        const payload = serializer.buildUpdatePayload(newContact);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                salutation: 'Ms',
                first_name: 'Jane',
                last_name: 'Doe',
                telephone: '07700900456',
                email: 'jane.doe@example.com'
            }
        };

        const contact = new Contact(dataWithAttributes);

        expect(contact.salutation).toBe(dataWithAttributes.attributes.salutation);
        expect(contact.first_name).toBe(dataWithAttributes.attributes.first_name);
        expect(contact.last_name).toBe(dataWithAttributes.attributes.last_name);
        expect(contact.telephone).toBe(dataWithAttributes.attributes.telephone);
        expect(contact.email).toBe(dataWithAttributes.attributes.email);
    });

    test('should handle missing or empty data', () => {
        const emptyContact = new Contact();

        expect(emptyContact.type).toBe('contacts');
        expect(emptyContact.salutation).toBe('');
        expect(emptyContact.first_name).toBe('');
        expect(emptyContact.last_name).toBe('');
        expect(emptyContact.telephone).toBe('');
        expect(emptyContact.email).toBe('');
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newContact.jsonApiMapping();

        expect(mapping.attributes).toContain('salutation');
        expect(mapping.attributes).toContain('first_name');
        expect(mapping.attributes).toContain('last_name');
        expect(mapping.attributes).toContain('telephone');
        expect(mapping.attributes).toContain('email');
    });

    test('should have correct static relationship definitions', () => {
        expect(Contact.relationships).toEqual([
            {
                name: 'customer_accounts',
                type: 'array',
                modelType: 'customer-accounts',
            },
            {
                name: 'representative',
                type: 'array',
                modelType: 'customer-interactions',
            },
            {
                name: 'properties',
                type: 'array',
                modelType: 'properties',
            },
        ]);
    });
});