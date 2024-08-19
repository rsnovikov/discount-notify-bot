import "reflect-metadata";
import { App } from "./app";
import { BotService } from "./bot/bot.service";
import { container } from "./inversify.config";
import { ContainerTypes } from "./container-types";

const main = () => {
  const app = new App(container.get<BotService>(ContainerTypes.BotService));
};

main();
