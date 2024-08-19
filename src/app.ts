import { inject } from "inversify";
import { ContainerTypes } from "./container-types.js";
import { BotService } from "./bot/bot.service.js";

export class App {
  constructor(@inject(ContainerTypes.BotService) private readonly botService: BotService) {}
}
