import { resolve } from "path";
import {
  Controller,
  HttpReponse,
  HttRequest,
} from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }
  async handle(httpRequest: HttRequest): Promise<HttpReponse> {
    const httpReponse = await this.controller.handle(httpRequest);
    return httpReponse;
  }
}
