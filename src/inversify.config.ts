import { Container } from "inversify";
import { IConfig } from "./config/config.interface";
import { ContainerTypes } from "./container-types";
import { ConfigService } from "./config/config.service";
import { QueryExecutorService } from "./query-executor/query-executor.service";
import { BotService } from "./bot/bot.service";
import { ParserService } from "./parser/parser.service";
import { UserService } from "./user/user.service";
import { ProductService } from "./product/product.service";
import { ProductUrlService } from "./product-url/product-url.service";
import { ProductPriceService } from "./product-price/product-price.service";

const container = new Container();
container.bind<IConfig>(ContainerTypes.Config).to(ConfigService);
container.bind<BotService>(ContainerTypes.BotService).to(BotService);
container.bind<QueryExecutorService>(ContainerTypes.QueryExecutorService).to(QueryExecutorService);
container.bind<ParserService>(ContainerTypes.ParserService).to(ParserService);
container.bind<UserService>(ContainerTypes.UserService).to(UserService);
container.bind<ProductService>(ContainerTypes.ProductService).to(ProductService);
container.bind<ProductUrlService>(ContainerTypes.ProductUrlService).to(ProductUrlService);
container.bind<ProductPriceService>(ContainerTypes.ProductPriceService).to(ProductPriceService);

export { container };
