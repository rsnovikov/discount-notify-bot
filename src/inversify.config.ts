import { Container } from "inversify";
import { IConfig } from "./config/config.interface";
import { TYPES } from "./TYPES";
import { ConfigService } from "./config/config.service";

const container = new Container();
container.bind<IConfig>(TYPES.Config).to(ConfigService);
container.bind<IConfig>(TYPES.Config).to(ConfigService);

export { container };
