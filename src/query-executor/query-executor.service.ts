import { inject, injectable } from "inversify";
import { TYPES } from "../TYPES";
import { IConfig } from "../config/config.interface";
import { Client, ClientConfig } from "pg";
import { ConfigKeys } from "../config/config-keys";
@injectable()
export class QueryExecutorService {
  private readonly clientConfig: ClientConfig;

  constructor(@inject(TYPES.Config) private readonly config: IConfig) {
    this.clientConfig = {
      database: config.get(ConfigKeys.POSTGRES_DB),
      user: config.get(ConfigKeys.POSTGRES_USER),
      password: config.get(ConfigKeys.POSTGRES_PASSWORD),
      port: Number(config.get(ConfigKeys.POSTGRES_PORT)),
    };

    this.checkConnection()
      .then(() => {
        console.log("successfully connected to postgres");
      })
      .catch((e) => {
        console.error(`Error while connect to postgres: ${e}`);
        process.exit(1);
      });
  }

  async executeQuery(query: string, params?: any[]) {
    const client = new Client(this.clientConfig);
    try {
      await client.connect();
      return await client.query(query, params);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      await client.end();
    }
  }

  async checkConnection() {
    try {
      const client = new Client(this.clientConfig);
      await client.connect();

      const res = await client.query("SELECT now()");
      await client.end();
    } catch (e) {
      throw e;
    }
  }
}
