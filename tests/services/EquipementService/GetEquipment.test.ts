import { describe, it, expect, mock } from "bun:test";
import { Equipment } from "@models/Equipment";
import { EquipmentModel } from "@models/EquipmentModel";
import { EquipmentManufacturer } from "@models/EquipmentManufacturer";
import { EquipmentService } from "@services/EquipmentService";
import { Client } from '../../../src';
import { Hydrator } from "@utils/Hydrator";

describe('Equipment Service', () => {
    const mockApiResponse = {
        data: [
            {
                id: "2075e5da-908f-40ba-b2e0-1813cc28a6f6",
                type: "equipment-items",
                attributes: {
                    serial: "CH001-A",
                    status: "active"
                },
                relationships: {
                    model: {
                        data: {
                            id: "a354c5cc-2c9a-44fa-80f6-de3d97946ccb",
                            type: "equipment-models"
                        }
                    },
                    vehicle: {
                        data: {
                            id: "df586364-42c5-4aa9-a9ba-bcf98ed09b21",
                            type: "vehicles"
                        }
                    }
                },
                meta: {
                    created_at: "2024-11-13T17:48:00Z",
                    modified_at: "2024-11-13T17:48:00Z"
                }
            },
            {
                id: "7e366a32-7e2c-4c91-a4a4-6a4c3ff7595e",
                type: "equipment-items",
                attributes: {
                    serial: "CH001-B",
                    status: "active"
                },
                relationships: {
                    model: {
                        data: {
                            id: "321e0a67-c47b-4ad6-abe2-239a212e12b8",
                            type: "equipment-models"
                        }
                    }
                },
                meta: {
                    created_at: "2024-09-13T06:48:13Z",
                    modified_at: "2024-09-13T06:48:13Z"
                }
            }
        ],
        included: [
            {
                id: "a354c5cc-2c9a-44fa-80f6-de3d97946ccb",
                type: "equipment-models",
                attributes: {
                    name: "TS55",
                    description: "Circular Saw 110",
                    documentation: [
                        {
                            name: "Instruction Manual",
                            description: "The official manual from Festool",
                            link: "https://www.festoolusa.com/-/media/tts/fcp/festool-usa/downloads/manuals/703959_003_ts_55_req_usa.pdf"
                        }
                    ]
                },
                relationships: {
                    manufacturer: {
                        data: {
                            id: "46aa4e71-6ab6-41d4-a045-84f0771afccc",
                            type: "equipment-manufacturers"
                        }
                    }
                }
            },
            {
                id: "321e0a67-c47b-4ad6-abe2-239a212e12b8",
                type: "equipment-models",
                attributes: {
                    name: "8406",
                    description: "Diamond drill 110v/240v",
                    documentation: []
                },
                relationships: {
                    manufacturer: {
                        data: {
                            id: "54a795eb-7011-4f09-8d80-0e2327aaab79",
                            type: "equipment-manufacturers"
                        }
                    }
                }
            },
            {
                id: "46aa4e71-6ab6-41d4-a045-84f0771afccc",
                type: "equipment-manufacturers",
                attributes: {
                    name: "Festool"
                }
            },
            {
                id: "54a795eb-7011-4f09-8d80-0e2327aaab79",
                type: "equipment-manufacturers",
                attributes: {
                    name: "Makita"
                }
            }
        ],
        links: {
            self: "https://api.ctrl-hub.com/v3/orgs/test-org/assets/equipment"
        }
    };

    describe('get()', () => {
        it('should correctly hydrate equipment items with nested relationships', async () => {
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

            const equipmentService = new EquipmentService(mockClient);

            const response = await equipmentService.get({
                include: ['model', 'model.manufacturer']
            });

            // Verify we got an array of equipment
            expect(Array.isArray(response.data)).toBe(true);
            const equipment = response.data as Equipment[];
            expect(equipment).toHaveLength(2);

            // Test first equipment item (Festool saw)
            const festoolItem = equipment[0];
            expect(festoolItem).toBeInstanceOf(Equipment);
            expect(festoolItem.id).toBe("2075e5da-908f-40ba-b2e0-1813cc28a6f6");
            expect(festoolItem.type).toBe("equipment-items");
            expect(festoolItem.serial).toBe("CH001-A");
            expect(festoolItem.meta).toEqual({
                created_at: "2024-11-13T17:48:00Z",
                modified_at: "2024-11-13T17:48:00Z"
            });

            // Test its model relationship
            const festoolModel = festoolItem.model as EquipmentModel;
            expect(festoolModel).toBeInstanceOf(EquipmentModel);
            expect(festoolModel.id).toBe("a354c5cc-2c9a-44fa-80f6-de3d97946ccb");
            expect(festoolModel.name).toBe("TS55");
            expect(festoolModel.documentation).toEqual([{
                name: "Instruction Manual",
                description: "The official manual from Festool",
                link: "https://www.festoolusa.com/-/media/tts/fcp/festool-usa/downloads/manuals/703959_003_ts_55_req_usa.pdf"
            }]);

            // Test its manufacturer relationship
            const festoolManufacturer = festoolModel.manufacturer as EquipmentManufacturer;
            expect(festoolManufacturer).toBeInstanceOf(EquipmentManufacturer);
            expect(festoolManufacturer.id).toBe("46aa4e71-6ab6-41d4-a045-84f0771afccc");
            expect(festoolManufacturer.name).toBe("Festool");

            // Test second equipment item (Makitaa drill)
            const makitaItem = equipment[1];
            expect(makitaItem).toBeInstanceOf(Equipment);
            expect(makitaItem.id).toBe("7e366a32-7e2c-4c91-a4a4-6a4c3ff7595e");
            expect(makitaItem.type).toBe("equipment-items");
            expect(makitaItem.serial).toBe("CH001-B");
            expect(makitaItem.meta).toEqual({
                created_at: "2024-09-13T06:48:13Z",
                modified_at: "2024-09-13T06:48:13Z"
            });

            // Test its model relationship
            const makitaModel = makitaItem.model as EquipmentModel;
            expect(makitaModel).toBeInstanceOf(EquipmentModel);
            expect(makitaModel.id).toBe("321e0a67-c47b-4ad6-abe2-239a212e12b8");
            expect(makitaModel.name).toBe("8406");
            expect(makitaModel.documentation).toEqual([]);

            // Test it's manufacturer relationship
            const makitaManufacturer = makitaModel.manufacturer as EquipmentManufacturer;
            expect(makitaManufacturer).toBeInstanceOf(EquipmentManufacturer);
            expect(makitaManufacturer.id).toBe("54a795eb-7011-4f09-8d80-0e2327aaab79");
            expect(makitaManufacturer.name).toBe("Makita");

            // Verify the request was made with correct parameters
            expect(mockClient.makeGetRequest).toHaveBeenCalledTimes(1);
        });
    });

    describe('Hydrator', () => {
        it('should correctly hydrate an array of equipment with nested relationships', () => {
            const hydrator = new Hydrator();

            const hydratedData = hydrator.hydrateResponse<Equipment>(
                mockApiResponse.data,
                mockApiResponse.included
            );

            expect(Array.isArray(hydratedData)).toBe(true);
            const equipment = hydratedData as Equipment[];

            // Test complete object structure matches expectations
            expect(equipment).toMatchObject([
                {
                    id: "2075e5da-908f-40ba-b2e0-1813cc28a6f6",
                    type: "equipment-items",
                    serial: "CH001-A",
                    model: {
                        id: "a354c5cc-2c9a-44fa-80f6-de3d97946ccb",
                        type: "equipment-models",
                        name: "TS55",
                        documentation: [{
                            name: "Instruction Manual",
                            description: "The official manual from Festool",
                            link: "https://www.festoolusa.com/-/media/tts/fcp/festool-usa/downloads/manuals/703959_003_ts_55_req_usa.pdf"
                        }],
                        manufacturer: {
                            id: "46aa4e71-6ab6-41d4-a045-84f0771afccc",
                            type: "equipment-manufacturers",
                            name: "Festool"
                        }
                    }
                },
                {
                    id: "7e366a32-7e2c-4c91-a4a4-6a4c3ff7595e",
                    type: "equipment-items",
                    serial: "CH001-B",
                    model: {
                        id: "321e0a67-c47b-4ad6-abe2-239a212e12b8",
                        type: "equipment-models",
                        name: "8406",
                        documentation: [],
                        manufacturer: {
                            id: "54a795eb-7011-4f09-8d80-0e2327aaab79",
                            type: "equipment-manufacturers",
                            name: "Makita"
                        }
                    }
                }
            ]);
        });
    });
});