import { describe, expect, test, beforeEach } from "bun:test";
import { User } from "@models/User";
import { JsonApiSerializer } from '../../src/utils/JsonSerializer';
import { Hydrator } from '../../src/utils/Hydrator';

describe('User Model', () => {
    const newId = 'l0m1n2o3-p4q5-r6s7-t8u9-v0w1x2y3z4a5';
    const newUserData = {
        attributes: {
            email: 'john.doe@example.com',
            identities: [
                {
                    id: 'auth0|123456789',
                    platform: 'auth0',
                    meta: {
                        organisation_id: 'org-123'
                    }
                }
            ],
            profile: {
                address: {
                    area: 'East',
                    country_code: 'GB',
                    county: 'Greater London',
                    name: 'Main Office',
                    number: '123',
                    postcode: 'EC1A 1BB',
                    street: 'Example Street',
                    town: 'London',
                    what3words: 'voice.piano.eager'
                },
                contact: {
                    landline: '020 7123 4567',
                    mobile: '07700 900123'
                },
                personal: {
                    dob: '1985-05-15',
                    first_name: 'John',
                    last_name: 'Doe',
                    username: 'johndoe'
                },
                settings: {
                    preferred_language: 'en',
                    timezone: 'Europe/London'
                },
                work: {
                    cscs: 'CSCS123456',
                    eusr: 'EUSR789012',
                    occupation: 'Engineer',
                    start_date: '2020-03-01'
                }
            }
        }
    };

    let newUser;
    let serializer;

    beforeEach(() => {
        newUser = new User(newUserData);
        const hydrator = new Hydrator();
        serializer = new JsonApiSerializer(hydrator.getModelMap());
    });

    const verifyPayloadStructure = (payload, includeId = false) => {
        const expectedPayload = {
            data: {
                relationships: {},
                type: "users",
                attributes: {
                    email: newUserData.attributes.email,
                    identities: newUserData.attributes.identities,
                    profile: newUserData.attributes.profile
                }
            }
        };

        if (includeId) {
            expectedPayload.data['id'] = newId;
        }

        expect(payload).toEqual(expectedPayload);
    };

    test('newly created model should have correct attributes', () => {
        expect(newUser.type).toBe('users');
        expect(newUser.email).toBe(newUserData.attributes.email);
        expect(newUser.identities).toEqual(newUserData.attributes.identities);
        
        // Check profile properties
        expect(newUser.profile.personal.first_name).toBe(newUserData.attributes.profile.personal.first_name);
        expect(newUser.profile.personal.last_name).toBe(newUserData.attributes.profile.personal.last_name);
        expect(newUser.profile.address.postcode).toBe(newUserData.attributes.profile.address.postcode);
        expect(newUser.profile.contact.mobile).toBe(newUserData.attributes.profile.contact.mobile);
        expect(newUser.profile.work.occupation).toBe(newUserData.attributes.profile.work.occupation);
    });

    test('create payload should have correct attributes', () => {
        const payload = serializer.buildCreatePayload(newUser);
        verifyPayloadStructure(payload);
    });

    test('patch payload should have correct attributes', () => {
        newUser.id = newId;
        const payload = serializer.buildUpdatePayload(newUser);
        verifyPayloadStructure(payload, true);
    });

    test('should handle input data with attributes structure', () => {
        const dataWithAttributes = {
            attributes: {
                email: 'jane.smith@example.com',
                identities: [
                    {
                        id: 'auth0|987654321',
                        platform: 'auth0',
                        meta: null
                    }
                ],
                profile: {
                    personal: {
                        first_name: 'Jane',
                        last_name: 'Smith',
                        username: 'janesmith'
                    }
                }
            }
        };

        const user = new User(dataWithAttributes);
        expect(user.email).toBe(dataWithAttributes.attributes.email);
        expect(user.identities).toEqual(dataWithAttributes.attributes.identities);
        expect(user.profile.personal.first_name).toBe(dataWithAttributes.attributes.profile.personal.first_name);
        expect(user.profile.personal.last_name).toBe(dataWithAttributes.attributes.profile.personal.last_name);
        
        // Default values for unspecified fields
        expect(user.profile.address.postcode).toBe('');
        expect(user.profile.work.occupation).toBe('');
    });

    test('should handle missing or empty data', () => {
        const emptyUser = new User();

        expect(emptyUser.type).toBe('users');
        expect(emptyUser.email).toBe('');
        expect(emptyUser.identities).toEqual([]);
        expect(emptyUser.profile.personal.first_name).toBe('');
        expect(emptyUser.profile.address.postcode).toBe('');
        expect(emptyUser.profile.work.occupation).toBe('');
    });

    test('jsonApiMapping should return correct mapping structure', () => {
        const mapping = newUser.jsonApiMapping();

        expect(mapping.attributes).toContain('email');
        expect(mapping.attributes).toContain('identities');
        expect(mapping.attributes).toContain('profile');
    });

    test('label method should return full name when available', () => {
        expect(newUser.label()).toBe('John Doe');
    });

    test('label method should return email when name not available', () => {
        const userWithoutName = new User({
            attributes: {
                email: 'no.name@example.com'
            }
        });
        expect(userWithoutName.label()).toBe('no.name@example.com');
    });
});