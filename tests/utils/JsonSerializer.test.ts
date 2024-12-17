import { describe, it, expect } from "bun:test";
import { JsonApiSerializer } from "@utils/JsonSerializer";
import { Equipment } from "@models/Equipment";
import { FormCategory } from '../../src';

describe('JsonApiSerializer', () => {
    describe('buildCreatePayload', () => {
        it('should transform equipment input to correct JSONAPI format', () => {

            const equipment = new Equipment();
            equipment.serial = "TestSerial";
            equipment.model = "a354c5cc-2c9a-44fa-80f6-de3d97946ccb";

            const payload = JsonApiSerializer.buildCreatePayload(equipment);

            let expectedPayload = {
                data: {
                    type: "equipment-items",
                    attributes: {
                        serial: "TestSerial"
                    },
                    relationships: {
                        model: {
                            data: {
                                type: "equipment-models",
                                id: "a354c5cc-2c9a-44fa-80f6-de3d97946ccb"
                            }
                        }
                    }
                }
            }

            // Exact expected output format
            expect(payload).toEqual(expectedPayload);
        });

        it('should transform a model whcih does not have getApiMapping', () => {
            const formCategory = new FormCategory();
            formCategory.name = "Test Category";

            const payload = JsonApiSerializer.buildCreatePayload(formCategory);

            const expectedPayload = {
                data: {
                    type: "form_categories",
                    attributes: {
                        name: "Test Category"
                    }
                }
            };

            expect(payload).toEqual(expectedPayload);
        });
    });
});