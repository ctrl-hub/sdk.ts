import type { Model } from "../types/Model";
type RoleAttributes = {
  name: string;
};
export declare class Role implements Model {
  id: string;
  type: string;
  attributes: RoleAttributes;
  meta: any;
  links: any;
  constructor();
  static hydrate(data: any): Role;
}
export {};
