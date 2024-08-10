import { Telegraf } from "telegraf";
import { ConfigKeys } from "../config/config-keys";
import { inject, injectable } from "inversify";
import { IConfig } from "../config/config.interface";
import { TYPES } from "../TYPES";

@injectable()
export class BotService {
  constructor(@inject(TYPES.Config) config: IConfig) {
    const bot = new Telegraf(config.get(ConfigKeys.TG_TOKEN));
    bot.start((ctx) => ctx.reply("Welcome"));
    bot.help((ctx) => ctx.reply("Send me a sticker"));
    bot.hears("hi", (ctx) => ctx.reply("Hey there"));
    bot.launch();
  }
}
