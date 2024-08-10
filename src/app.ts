import { inject } from "inversify";
import "./inversify.config.ts";
import { TYPES } from "./TYPES.js";
import { BotService } from "./bot/bot.service.js";

export class App {
  constructor(@inject(TYPES.BotService) botService: BotService) {
    console.log(botService);
  }
}
