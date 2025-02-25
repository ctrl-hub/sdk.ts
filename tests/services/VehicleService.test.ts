import { describe, it, expect, mock } from "bun:test";
import { Vehicle } from "@models/Vehicle";
import { VehicleSpecification } from "@models/VehicleSpecification";
import { VehicleModel } from "@models/VehicleModel";
import { VehicleManufacturer } from "@models/VehicleManufacturer";
import { VehiclesService } from "@services/VehiclesService";
import { Client } from '../../src';
import { Hydrator } from "@utils/Hydrator";

describe('Vehicle Relationship Hydration', () => {
    const mockApiResponse = {
        "data": {
            "id": "5e7b997c-0940-4efd-b600-add43e35a058",
            "type": "vehicles",
            "attributes": {
                "colour": "red",
                "description": null,
                "registration": "YO15HWT",
                "status": "active",
                "vin": "sdf1"
            },
            "relationships": {
                "assignee": {
                    "data": {
                        "id": "5b89ac0b-6d20-4c17-8475-47641ac0f16d",
                        "type": "users"
                    }
                },
                "equipment": {
                    "data": [
                        {
                            "id": "2075e5da-908f-40ba-b2e0-1813cc28a6f6",
                            "type": "equipment-items"
                        }
                    ]
                },
                "specification": {
                    "data": {
                        "id": "0036e7dc-8207-4124-a698-5c77584e831a",
                        "type": "vehicle-specifications"
                    }
                }
            },
            "meta": {
                "counts": {
                    "equipment": 1
                },
                "created_at": "2025-01-28T22:26:16Z",
                "modified_at": "2025-01-29T14:50:43Z",
                "sorn": false,
                "has_recall": false,
                "mot": {
                    "is_valid": true,
                    "records": 10,
                    "last": {
                        "at": "2025-01-09T09:51:42Z",
                        "id": "153862303177"
                    }
                },
                "tax": {
                    "is_valid": true,
                    "due": "2026-01-01"
                },
                "last_odometer_reading": 67055,
                "checks": {
                    "inventory": {
                        "count": 0,
                        "last": {
                            "at": null,
                            "id": ""
                        }
                    },
                    "inspection": {
                        "count": 0,
                        "last": {
                            "at": null,
                            "id": ""
                        }
                    }
                },
                "dvla": {
                    "mot": {
                        "exists": true,
                        "data": {
                            "make": "FORD",
                            "model": "FOCUS",
                            "first_used": "2015-07-31T00:00:00Z",
                            "fuel_type": "Petrol",
                            "colour": "Red",
                            "registration_date": "2015-07-31T00:00:00Z",
                            "manufacture_date": "2015-07-31T00:00:00Z",
                            "engine_size": "1596",
                            "has_outstanding_recall": "unknown"
                        },
                        "last_sync": "2025-01-29T14:50:45.274Z"
                    },
                    "ves": {
                        "exists": true,
                        "data": {
                            "art_end_date": "",
                            "co2_emissions": 146,
                            "colour": "RED",
                            "date_of_last_v5c_issued": "2023-03-27",
                            "engine_capacity": 1596,
                            "euro_status": "",
                            "fuel_type": "PETROL",
                            "make": "FORD",
                            "marked_for_export": false,
                            "month_of_first_registration": "2015-07",
                            "mot_status": "Valid",
                            "real_driving_emissions": "",
                            "registration_number": "YO15HWT",
                            "revenue_weight": 1825,
                            "tax_due_date": "2026-01-01",
                            "tax_status": "Taxed",
                            "type_approval": "M1",
                            "wheelplan": "2 AXLE RIGID BODY",
                            "year_of_manufacture": 2015
                        },
                        "last_sync": "2025-01-29T14:50:45.274Z"
                    }
                }
            }
        },
        "meta": {},
        "jsonapi": {
            "version": "1.0",
            "meta": {}
        },
        "links": {
            "self": "https://api.ctrl-hub.run/v3/orgs/6df86de8-e3c1-4e8e-aa12-76305d4a491f/assets/vehicles/5e7b997c-0940-4efd-b600-add43e35a058?include=specification%2Cspecification.model%2Cspecification.model.manufacturer%2Cstatus%2Cassignee"
        },
        "included": [
            {
                "id": "0036e7dc-8207-4124-a698-5c77584e831a",
                "type": "vehicle-specifications",
                "attributes": {
                    "documentation": [],
                    "emissions": 146,
                    "engine_capacity": 1596,
                    "fuel_type": "petrol",
                    "wheelplan": "2 AXLE RIGID BODY",
                    "year": 2015
                },
                "relationships": {
                    "model": {
                        "data": {
                            "id": "37b62d2e-d23d-4868-89b2-6c07966381eb",
                            "type": "vehicle-models"
                        }
                    }
                }
            },
            {
                "id": "5b89ac0b-6d20-4c17-8475-47641ac0f16d",
                "type": "users",
                "attributes": {
                    "email": "engineers@ctrl-hub.com",
                    "identities": [
                        {
                            "platform": "kratos",
                            "id": "5ee46479-b578-4ae6-905b-01535d1e6b74",
                            "meta": {}
                        }
                    ],
                    "profile": {
                        "work": {
                            "occupation": "Ctrl Hub",
                            "cscs": "",
                            "eusr": "",
                            "start_date": "2024-04-18"
                        },
                        "personal": {
                            "first_name": "Johnny",
                            "last_name": "Greaves",
                            "dob": "",
                            "username": "johnny.greaves"
                        },
                        "contact": {
                            "mobile": "",
                            "landline": ""
                        },
                        "address": {
                            "number": "",
                            "name": "",
                            "street": "Test Street",
                            "area": "",
                            "town": "Test Town",
                            "county": "Test County",
                            "postcode": "AA1 1AA",
                            "country_code": "GB",
                            "what3words": ""
                        },
                        "settings": {
                            "preferred_language": "en-GB",
                            "timezone": "Europe/London"
                        }
                    }
                }
            },
            {
                "id": "37b62d2e-d23d-4868-89b2-6c07966381eb",
                "type": "vehicle-models",
                "attributes": {
                    "name": "FOCUS"
                },
                "relationships": {
                    "categories": {
                        "data": []
                    },
                    "manufacturer": {
                        "data": {
                            "id": "82ed522e-0012-4504-9f9a-156e5761c61e",
                            "type": "vehicle-manufacturers"
                        }
                    }
                }
            },
            {
                "id": "82ed522e-0012-4504-9f9a-156e5761c61e",
                "type": "vehicle-manufacturers",
                "attributes": {
                    "name": "Ford"
                }
            }
        ]
    };

    describe('VehiclesService', () => {
        it('should correctly hydrate a vehicle with all its relationships', async () => {
            // Mock the client
            const mockClient = {
                makeGetRequest: mock(async () => ({
                    data: mockApiResponse.data,
                    included: mockApiResponse.included,
                    meta: mockApiResponse.meta,
                    links: mockApiResponse.links,
                    ok: true,
                    statusCode: 200,
                    headers: {}
                })),
                config: {
                    organisationId: 'test-org',
                    baseDomain: 'https://api.test.com'
                }
            } as unknown as Client;

            const vehiclesService = new VehiclesService(mockClient);

            const response = await vehiclesService.get("5e7b997c-0940-4efd-b600-add43e35a058", {
                include: ['specification', 'specification.model', 'specification.model.manufacturer', 'statis', 'assignee']
            });

            const vehicle = response.data as Vehicle;

            // Test vehicle properties
            expect(vehicle.id).toBe("5e7b997c-0940-4efd-b600-add43e35a058");
            expect(vehicle.type).toBe("vehicles");
            expect(vehicle.registration).toBe("YO15HWT");
            expect(vehicle.vin).toBe("sdf1");
            expect(vehicle.colour).toBe("red");

            // Test specification relationship
            const spec = vehicle.specification as VehicleSpecification;
            expect(spec).toBeInstanceOf(VehicleSpecification);
            expect(spec.id).toBe("0036e7dc-8207-4124-a698-5c77584e831a");
            expect(spec.emissions).toBe(146);
            expect(spec.engine_capacity).toBe(1596);
            expect(spec.fuel_type).toBe("petrol");
            expect(spec.wheelplan).toBe("2 AXLE RIGID BODY");
            expect(spec.year).toBe(2015);
            expect(spec.documentation).toEqual([]);

            // Test nested model relationship
            expect(spec.model).toBeInstanceOf(VehicleModel);
            expect(spec.model.id).toBe("37b62d2e-d23d-4868-89b2-6c07966381eb");
            expect(spec.model.type).toBe("vehicle-models");
            expect(spec.model.name).toBe("FOCUS");

            const manufacturer = spec.model.manufacturer as VehicleManufacturer;
            expect(manufacturer).toBeInstanceOf(VehicleManufacturer);
            expect(manufacturer.id).toBe("82ed522e-0012-4504-9f9a-156e5761c61e");
            expect(manufacturer.name).toBe("Ford");

            // Verify the makeGetRequest was called with correct parameters
            expect(mockClient.makeGetRequest).toHaveBeenCalledTimes(1);
        });
    });

});