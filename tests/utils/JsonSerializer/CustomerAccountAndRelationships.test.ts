import { describe, it, expect } from "bun:test";
import { JsonApiSerializer } from "@utils/JsonSerializer";
import { Hydrator } from '@utils/Hydrator';
import { CustomerAccount, Property, Contact } from '../../../src';

describe('JsonApiSerializer for Customer Account and Relationships', () => {
    const hydrator = new Hydrator();
    const jsonApiSerializer = new JsonApiSerializer(hydrator.getModelMap());

    describe('buildCreatePayload', () => {
        it('should transform customer account and relationships to correct JSONAPI format', () => {

            const customerAccount = new CustomerAccount();
            customerAccount.id = "cust-123";

            const property1 = new Property();
            property1.id = "prop-001";
            property1.uprn = 10023456;
            property1.address = {
                description: "Main Office",
                department: "Operations",
                organisation: "ABC Ltd",
                number: "42",
                name: "",
                thoroughfare: "High Street",
                dependent_thoroughfare: "",
                post_town: "London",
                postcode: "W1A 1AA",
                pobox: "",
                country: "UK"
            };

            const property2 = new Property();
            property2.id = "prop-002";
            property2.uprn = 10023457;
            property2.address = {
                description: "Warehouse",
                department: "Logistics",
                organisation: "ABC Ltd",
                number: "15",
                name: "Industrial Estate",
                thoroughfare: "Factory Road",
                dependent_thoroughfare: "",
                post_town: "Manchester",
                postcode: "M1 1BB",
                pobox: "",
                country: "UK"
            };

            // Create contacts
            const contact1 = new Contact();
            contact1.id = "cont-001";
            contact1.first_name = "John";
            contact1.last_name = "Smith";
            contact1.email = "john.smith@example.com";
            contact1.telephone = "07700 900123";

            const contact2 = new Contact();
            contact2.id = "cont-002";
            contact2.first_name = "Jane";
            contact2.last_name = "Doe";
            contact2.email = "jane.doe@example.com";
            contact2.telephone = "07700 900456";

            customerAccount.contacts = [contact1, contact2];
            customerAccount.properties = [property1, property2];

            const payload = (new JsonApiSerializer(hydrator.getModelMap())).buildCreatePayload(customerAccount);
            const { data } = payload;

            expect(data.type).toBe("customer-accounts");
            expect(data.relationships).toBeDefined();
            expect(data.relationships.contacts).toBeDefined();
            expect(data.relationships.properties).toBeDefined();

            expect(data.relationships).toEqual({
                "properties":{
                    "data":[
                        {
                            "type":"properties",
                            "id":"prop-001"
                        },
                        {
                            "type":"properties",
                            "id":"prop-002"
                        }
                    ]
                },
                "contacts":{
                    "data":[
                        {
                            "type":"contacts",
                            "id":"cont-001"
                        },
                        {
                            "type":"contacts",
                            "id":"cont-002"
                        }
                    ]
                }
            });
        });
    });
});