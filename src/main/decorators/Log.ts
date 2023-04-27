import { LogErrorRepository } from "../../data/protocols/db/log-error-repository";
import {
  Controller,
  HttpReponse,
  HttRequest,
} from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logErrorRepository: LogErrorRepository;
  constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }
  async handle(httpRequest: HttRequest): Promise<HttpReponse> {
    const httpReponse = await this.controller.handle(httpRequest);
    if (httpReponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpReponse.body.stack);
    }
    return httpReponse;
  }
}
