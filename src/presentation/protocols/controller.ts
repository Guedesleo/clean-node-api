import { HttpReponse, HttRequest } from "./http";

export interface Controller {
  handle(httpRequest: HttRequest): Promise<HttpReponse>;
}
