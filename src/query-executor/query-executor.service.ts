import { inject, injectable } from "inversify";
import { TYPES } from "../TYPES";
import { IConfig } from "../config/config.interface";
import { ClientConfig } from "pg";
@injectable()
export class QueryExecutorService {
  private readonly clientConfig: ClientConfig;

  constructor(@inject(TYPES.Config) private readonly config: IConfig) {
    this.clientConfig = {};
    try {
    } catch (e) {}
  }

  executeQuery() {
    return "queryExecute";
    // try {
    //   const client = new Client({
    //     user: this.config.get(ConfigKeys.POSTGRES_USER),
    //   });
    // } catch (e) {}
  }
}
