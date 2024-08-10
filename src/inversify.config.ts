import { Container } from "inversify";
import { IConfig } from "./config/config.interface";
import { TYPES } from "./TYPES";
import { ConfigService } from "./config/config.service";
import { QueryExecutorService } from "./query-executor/query-executor.service";
import { BotService } from "./bot/bot.service";
import { ParserService } from "./parser/parser.service";

const container = new Container();
container.bind<IConfig>(TYPES.Config).to(ConfigService);
container.bind<BotService>(TYPES.BotService).to(BotService);
container
  .bind<QueryExecutorService>(TYPES.QueryExecutorService)
  .to(QueryExecutorService);
container.bind<ParserService>(TYPES.ParserService).to(ParserService);

export { container };
