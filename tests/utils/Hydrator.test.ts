import { describe, it, expect, beforeEach } from "bun:test";
import { Hydrator } from "@utils/Hydrator";
import { FormCategory } from "@models/FormCategory";
import { ServiceAccount } from "@models/ServiceAccount";
import { ServiceAccountKey } from "@models/ServiceAccountKey";

describe('Hydrator', () => {
    let hydrator: Hydrator;
    let services: Record<string, any>;

    beforeEach(() => {
        services = {
            'serviceAccounts': {
                model: ServiceAccount,
                type: 'service-accounts'
            },
            'serviceAccountKeys': {
                model: ServiceAccountKey,
                type: 'service-account-keys'
            }
        };

        hydrator = new Hydrator(services);
    });

    it('should hydrate a json object', () => {

        let dataToTest = {
            "data":{
                "type":"service-accounts",
                "id":"5766f0d1-8cd5-4fd1-939d-a0f3b0fa26dd",
                "attributes":{
                    "description":"Used to send data from devices to Ctrl Hub",
                    "email":"example@example.com",
                    "enabled":true,
                    "name":"Tester"
                },
                "relationships":{
                    "keys":{
                        "data":[
                            {
                                "type":"service-account-keys",
                                "id":"afc99e36-bbdc-4a18-ace5-a8f0f3aa2114"
                            }
                        ]
                    }
                },
                "meta":{
                    "created_at":"2024-08-06T14:55:03Z"
                }
            },
            "included":[
                {
                    "type":"service-account-keys",
                    "id":"afc99e36-bbdc-4a18-ace5-a8f0f3aa2114",
                    "attributes":{
                        "client_id":"664417180036",
                        "enabled":true
                    },
                    "meta":{
                        "created_at":"2024-10-11T14:43:52Z",
                        "expires_at":"2025-10-11T14:43:52Z"
                    }
                }
            ]
        }

        let hydrated = hydrator.hydrateResponse(services.serviceAccounts, dataToTest);
        expect(hydrated.data.id).toBe("5766f0d1-8cd5-4fd1-939d-a0f3b0fa26dd");
        expect(hydrated.data.attributes.name).toBe("Tester");
        expect(hydrated.data.attributes.description).toBe("Used to send data from devices to Ctrl Hub");
        expect(hydrated.data.attributes.email).toBe("example@example.com");
        expect(hydrated.data.attributes.enabled).toBe(true);
        expect(hydrated.data.meta.created_at).toBe("2024-08-06T14:55:03Z");

        // Assert relationships has been hydrated
        expect(hydrated.data.relationships.keys.data[0].id).toBe("afc99e36-bbdc-4a18-ace5-a8f0f3aa2114");
        expect(hydrated.data.relationships.keys.data[0].type).toBe("service-account-keys");
        expect(hydrated.data.relationships.keys.data[0].attributes.client_id).toBe("664417180036");
        expect(hydrated.data.relationships.keys.data[0].attributes.enabled).toBe(true);
        expect(hydrated.data.relationships.keys.data[0].meta.created_at).toBe("2024-10-11T14:43:52Z");
        expect(hydrated.data.relationships.keys.data[0].meta.expires_at).toBe("2025-10-11T14:43:52Z");
    });
});