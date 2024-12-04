import { ClientConfigInterface} from "./ClientConfig";
import { RequestOptions } from "./utils/RequestOptions";
import { Requests } from "./utils/Requests";
import { Hydrator } from "./utils/Hydrator";
import { FormCategoriesService } from "./services/FormCategoriesService";
import { RolesService } from "./services/RolesService";
import { PermissionsService } from "./services/PermissionsService";
import { SubmissionsService } from "./services/SubmissionsService";
import { FormsService } from "./services/FormsService";
import { ServiceAccountsService } from "./services/ServiceAccountService";
import { ServiceAccountKeysService } from "./services/ServiceAccountKeysService";
import {InternalResponse} from "./types/Response";
import {GroupsService} from "./services/GroupService";
import { VehiclesService } from "./services/VehiclesService";
import { EquipmentService } from "./services/EquipmentService";

export class Client {
  readonly config: ClientConfigInterface;
  public organisation: string;
  public services: Record<string, any> = {};
  public hydrator: Hydrator;
  public bearerToken: string = '';
  private tokenPromise: Promise<void> | null = null;

  constructor(config: ClientConfigInterface) {
    this.config = config;
    this.organisation = "";
    this.hydrator = new Hydrator(this.services);

    if (config.clientId && config.clientSecret && config.authDomain) {
      this.tokenPromise = this.getToken();
    }
  }

  async getToken(){
    const url = this.config.authDomain || '';

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", this.config.clientId || '');
    params.append("client_secret", this.config.clientSecret || '');

    const response = await fetch(url + '/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: params.toString()
    });

    let tokenJson = await response.json();

    if (tokenJson.access_token) {
      this.bearerToken = tokenJson.access_token;
    }
  }

  async ensureAuthenticated() {
    if (this.tokenPromise) {
      await this.tokenPromise;
      this.tokenPromise = null;
    }
  }

  public roles(): RolesService {
    return new RolesService(this);
  }

  public serviceAccountKeys(): ServiceAccountKeysService {
    return new ServiceAccountKeysService(this);
  }

  public serviceAccounts(): ServiceAccountsService {
    return new ServiceAccountsService(this);
  }

  public formCategories(): FormCategoriesService {
    return new FormCategoriesService(this);
  }

  public forms(): FormsService {
    return new FormsService(this);
  }

  public submissions(): SubmissionsService {
    return new SubmissionsService(this);
  }

  public permissions(): PermissionsService {
    return new PermissionsService(this);
  }

  public groups(): GroupsService {
    return new GroupsService(this);
  }

  public vehicles(): VehiclesService {
    return new VehiclesService(this);
  }

  public equipment(): EquipmentService {
    return new EquipmentService(this);
  }

  setOrganisationSlug(organisation: string) {
    this.config.organisationId = organisation;
  }

  finalEndpoint(url: string): string {
    return `${this.config.baseDomain}${url.replace(":orgId", this.config.organisationId.toString())}`;
  }

  async makeDeleteRequest(
      endpoint: string,
  ): Promise<any> {
    await this.ensureAuthenticated();

    let url = Requests.buildRequestURL(endpoint);

    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.bearerToken) {
      headers['Authorization'] = `Bearer ${this.bearerToken}`;
    }

    try {
      const fetchResponse = await fetch(url, {
        method: 'DELETE',
        headers: headers,
        credentials: 'include',
      });

      let json = await fetchResponse.json();
      return Requests.buildInternalResponse(fetchResponse, json);
    } catch (error) {
      return Requests.buildInternalErrorResponse(error);
    }
  }

  async makePostRequest(
      baseEndpoint: string,
      body?: any,
      param?: string | RequestOptions | null,
  ): Promise<any> {
    await this.ensureAuthenticated();

    let url = Requests.buildRequestURL(baseEndpoint, param);

    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.bearerToken) {
      headers['Authorization'] = `Bearer ${this.bearerToken}`;
    }

    try {
      const fetchResponse = await fetch(url, {
        method: 'POST',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(body),
      });

      let json = await fetchResponse.json();
      return Requests.buildInternalResponse(fetchResponse, json);
    } catch (error) {
      return Requests.buildInternalErrorResponse(error);
    }
  }

  async makeGetRequest(
    baseEndpoint: string,
    param?: string | RequestOptions,
  ): Promise<InternalResponse> {
    await this.ensureAuthenticated();

    let url = Requests.buildRequestURL(baseEndpoint, param);

    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.bearerToken) {
      headers['Authorization'] = `Bearer ${this.bearerToken}`;
    }

    try {
      // @todo switch on cookie, "X-Session-Token" or client_credentials
      const fetchResponse = await fetch(url, {
        credentials: "include", // @todo only required for cookie based auth,
        headers: headers
      });
      let json = await fetchResponse.json();
      return Requests.buildInternalResponse(fetchResponse, json);
    } catch (error) {
      return Requests.buildInternalErrorResponse(error);
    }
  }

}
