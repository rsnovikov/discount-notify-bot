import { inject } from "inversify";
import { TYPES } from "./TYPES.js";
import { BotService } from "./bot/bot.service.js";

export class App {
  constructor(
    @inject(TYPES.BotService) private readonly botService: BotService,
  ) {}
}
