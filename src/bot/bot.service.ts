import { Telegraf } from "telegraf";
import { ConfigKeys } from "../config/config-keys";
import { inject, injectable } from "inversify";
import { IConfig } from "../config/config.interface";
import { TYPES } from "../TYPES";
import { ParserService } from "../parser/parser.service";

@injectable()
export class BotService {
  constructor(
    @inject(TYPES.Config) private readonly config: IConfig,
    @inject(TYPES.ParserService) private readonly parserService: ParserService,
  ) {
    const bot = new Telegraf(config.get(ConfigKeys.TG_TOKEN));
    // bot.start((ctx) => ctx.reply("asd"));
    // bot.help((ctx) => ctx.reply("Send me a sticker"));
    bot.hears(
      /^https:\/\/[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+(?:\/[^\s]*)?$/,
      async (ctx) => {
        ctx.message.text;
        const result = await parserService.parseProduct(ctx.message.text);
        ctx.reply(result);
      },
    );
    // bot.on(message());
    // bot.hears("");
    bot.launch();
  }
}
