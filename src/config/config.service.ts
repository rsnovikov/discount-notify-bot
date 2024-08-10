import { config, DotenvParseOutput } from "dotenv";
import { ConfigKeys } from "./config-keys";
import { IConfig } from "./config.interface";
import { injectable } from "inversify";

@injectable()
export class ConfigService implements IConfig {
  private readonly parsed: DotenvParseOutput;
  constructor() {
    const { parsed, error } = config();

    if (error) {
      console.error("Error parse .env");
      process.exit(1);
    }

    if (!parsed) {
      console.error("No .env");
      process.exit(1);
    }
    this.parsed = parsed;
    const missedParams: string[] = [];

    for (const key in ConfigKeys) {
      if (!parsed[key]) {
        missedParams.push(key);
      }
    }

    if (missedParams.length > 0) {
      console.error(`Miss ${missedParams.join(", ")} in .env`);
      process.exit(1);
    }
  }

  get(key: ConfigKeys) {
    return this.parsed[key];
  }
}
