import { ClientConfig } from "./ClientConfig";
import { RequestOptions } from "../utils/RequestOptions";
import { Hydrator } from "../utils/Hydrator";
import type { Service } from "../types/Service";
import type { ServiceMethods } from "../types/ServiceMethods";
import type { InternalResponse } from "../types/Response";
export declare class Client {
  readonly config: ClientConfig;
  organisation: string;
  services: Record<string, Service>;
  hydrator: Hydrator;
  formCategories: ServiceMethods;
  permissions: ServiceMethods;
  roles: ServiceMethods;
  serviceAccounts: ServiceMethods;
  constructor(config: ClientConfig);
  setOrganisationSlug(organisation: string): void;
  finalEndpoint(service: Service): string;
  private setupProxies;
  makeGetRequest(
    baseEndpoint: string,
    param?: string | RequestOptions | null,
  ): Promise<any>;
  getResource(
    service: Service,
    param: string | RequestOptions | null,
  ): Promise<InternalResponse>;
}
