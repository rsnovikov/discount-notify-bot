import "reflect-metadata";
import { App } from "./app";
import { BotService } from "./bot/bot.service";
import { container } from "./inversify.config";
import { TYPES } from "./TYPES";

const main = () => {
  const app = new App(container.get<BotService>(TYPES.BotService));
};

main();
