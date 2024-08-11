import { Telegraf } from "telegraf";
import { ConfigKeys } from "../config/config-keys";
import { inject, injectable } from "inversify";
import { IConfig } from "../config/config.interface";
import { TYPES } from "../TYPES";
import { ParserService } from "../parser/parser.service";
import { UserService } from "../user/user.service";

@injectable()
export class BotService {
  constructor(
    @inject(TYPES.Config) private readonly config: IConfig,
    @inject(TYPES.ParserService) private readonly parserService: ParserService,
    @inject(TYPES.UserService)
    private readonly userService: UserService,
  ) {
    const bot = new Telegraf(config.get(ConfigKeys.TG_TOKEN));

    bot.start(async (ctx) => {
      try {
        const user = await userService.create({ tgId: ctx.from.id });
        ctx.reply(JSON.stringify(user));
      } catch (e) {
        console.error(e);
        ctx.reply("Ошибка");
      }
    });

    bot.hears(
      /^https:\/\/[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+(?:\/[^\s]*)?$/,
      async (ctx) => {
        console.log(ctx.message.from.id);
        const result = await parserService.parseProduct(ctx.message.text);
        ctx.reply(result);
      },
    );

    bot.launch();
  }
}
