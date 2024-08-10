import { ConfigKeys } from "./config-keys";

export interface IConfig {
  get(key: ConfigKeys): string;
}
