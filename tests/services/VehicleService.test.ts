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
        data: {
            id: "2020d855-d835-466a-982b-350efdbf76dc",
            type: "vehicles",
            attributes: {
                colour: "green",
                description: null,
                registration: "TS21 OTR",
                status: "active",
                vin: "1FAFP66L0WK258659"
            },
            relationships: {
                equipment: {
                    data: []
                },
                specification: {
                    data: {
                        id: "b17e2e56-62b7-449e-9105-aa195ce41f89",
                        type: "vehicle-specifications"
                    }
                }
            },
            meta: {
                created_at: "2024-11-13T17:48:00Z",
                modified_at: "2024-11-13T17:48:00Z"
            }
        },
        included: [
            {
                id: "b17e2e56-62b7-449e-9105-aa195ce41f89",
                type: "vehicle-specifications",
                attributes: {
                    documentation: [
                        {
                            name: "Owner's Manual",
                            description: "Maintenance and troubleshooting advice",
                            link: "https://www.fordservicecontent.com/Ford_Content/Catalog/owner_information/CG3750en-202101-20210107154136.pdf"
                        }
                    ],
                    emissions: 157.1,
                    engine: "2l",
                    fuel: "petrol",
                    transmission: "automatic",
                    year: 2024
                },
                relationships: {
                    model: {
                        data: {
                            id: "b729434a-909d-48e2-b97c-08276f5497eb",
                            type: "vehicle-models"
                        }
                    }
                }
            },
            {
                id: "b729434a-909d-48e2-b97c-08276f5497eb",
                type: "vehicle-models",
                attributes: {
                    name: "Transit"
                },
                relationships: {
                    manufacturer: {
                        data: {
                            id: "9e4cd1b2-928f-4d1d-9cb8-fd663b0df596",
                            type: "vehicle-manufacturers"
                        }
                    }
                }
            },
            {
                id: "9e4cd1b2-928f-4d1d-9cb8-fd663b0df596",
                type: "vehicle-manufacturers",
                attributes: {
                    name: "Ford"
                }
            }
        ],
        meta: {},
        links: {
            self: "https://api.ctrl-hub.com/v3/orgs/ef0fcfd6-2a18-4c27-b2c2-b2563859b3b1/assets/vehicles/2020d855-d835-466a-982b-350efdbf76dc"
        }
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

            const response = await vehiclesService.get("2020d855-d835-466a-982b-350efdbf76dc", {
                include: ['equipment', 'specification', 'specification.model', 'specification.model.manufacturer']
            });

            const vehicle = response.data as Vehicle;

            // Test vehicle properties
            expect(vehicle.id).toBe("2020d855-d835-466a-982b-350efdbf76dc");
            expect(vehicle.type).toBe("vehicles");
            expect(vehicle.registration).toBe("TS21 OTR");
            expect(vehicle.vin).toBe("1FAFP66L0WK258659");
            expect(vehicle.colour).toBe("green");

            // Test specification relationship
            const spec = vehicle.specification as VehicleSpecification;
            expect(spec).toBeInstanceOf(VehicleSpecification);
            expect(spec.id).toBe("b17e2e56-62b7-449e-9105-aa195ce41f89");
            expect(spec.emissions).toBe(157.1);
            expect(spec.engine).toBe("2l");
            expect(spec.fuel).toBe("petrol");
            expect(spec.transmission).toBe("automatic");
            expect(spec.year).toBe(2024);
            expect(spec.documentation).toEqual([{
                name: "Owner's Manual",
                description: "Maintenance and troubleshooting advice",
                link: "https://www.fordservicecontent.com/Ford_Content/Catalog/owner_information/CG3750en-202101-20210107154136.pdf"
            }]);

            // Test nested model relationship
            const model = spec.model as VehicleModel;
            expect(model).toBeInstanceOf(VehicleModel);
            expect(model.id).toBe("b729434a-909d-48e2-b97c-08276f5497eb");
            expect(model.name).toBe("Transit");

            // Test nested manufacturer relationship
            const manufacturer = model.manufacturer as VehicleManufacturer;
            expect(manufacturer).toBeInstanceOf(VehicleManufacturer);
            expect(manufacturer.id).toBe("9e4cd1b2-928f-4d1d-9cb8-fd663b0df596");
            expect(manufacturer.name).toBe("Ford");

            // Verify the makeGetRequest was called with correct parameters
            expect(mockClient.makeGetRequest).toHaveBeenCalledTimes(1);
        });
    });

    describe('Hydrator', () => {
        it('should correctly hydrate nested relationships', () => {
            const hydrator = new Hydrator();

            const hydratedData = hydrator.hydrateResponse<Vehicle>(
                mockApiResponse.data,
                mockApiResponse.included
            );

            // Since hydrateResponse can return T | T[], we need to assert it's a single vehicle
            expect(Array.isArray(hydratedData)).toBe(false);
            const vehicle = hydratedData as Vehicle;

            // Test the complete object structure
            expect(vehicle).toMatchObject({
                id: "2020d855-d835-466a-982b-350efdbf76dc",
                type: "vehicles",
                registration: "TS21 OTR",
                vin: "1FAFP66L0WK258659",
                colour: "green",
                specification: {
                    id: "b17e2e56-62b7-449e-9105-aa195ce41f89",
                    type: "vehicle-specifications",
                    emissions: 157.1,
                    engine: "2l",
                    fuel: "petrol",
                    transmission: "automatic",
                    year: 2024,
                    documentation: [{
                        name: "Owner's Manual",
                        description: "Maintenance and troubleshooting advice",
                        link: "https://www.fordservicecontent.com/Ford_Content/Catalog/owner_information/CG3750en-202101-20210107154136.pdf"
                    }],
                    model: {
                        id: "b729434a-909d-48e2-b97c-08276f5497eb",
                        type: "vehicle-models",
                        name: "Transit",
                        manufacturer: {
                            id: "9e4cd1b2-928f-4d1d-9cb8-fd663b0df596",
                            type: "vehicle-manufacturers",
                            name: "Ford"
                        }
                    }
                }
            });
        });
    });
});