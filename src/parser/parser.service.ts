import { parse } from "node-html-parser";
import fetch from "node-fetch";
import { inject, injectable } from "inversify";
import { TYPES } from "../TYPES";
import { IConfig } from "../config/config.interface";
import { ConfigKeys } from "../config/config-keys";

@injectable()
export class ParserService {
  private readonly userAgent: string;
  constructor(@inject(TYPES.Config) config: IConfig) {
    this.userAgent = config.get(ConfigKeys.USER_AGENT);
  }

  async parseProduct(productUrl: string): Promise<string> {
    try {
      const urlObj = new URL(productUrl);
      const response = await fetch(productUrl, {
        headers: {
          // TODO: add geo
          // TODO: add correct user-agent
          "User-Agent": this.userAgent,
          Host: urlObj.hostname,
        },
      });
      const html = await response.text();
      const root = parse(html);

      const price = Number(root.querySelector("[itemprop=price]")?.textContent);
      const name = root.querySelector("h1[itemprop=name]")?.textContent;

      return JSON.stringify({
        name,
        price,
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
