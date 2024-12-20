import { describe, it, expect } from "bun:test";
import { Permission } from "@models/Permission"

describe('Permission', () => {

    describe('hydrate', () => {
        it('should correctly hydrate a Permission from data', () => {
            const data = {
                id: "368eff50-b3bd-4ed1-8ea7-15530108a335",
                attributes: {
                    description: "Sample Permission",
                },
            }
        });
    });
});