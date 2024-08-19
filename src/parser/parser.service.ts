import { parse } from "node-html-parser";
import fetch from "node-fetch";
import { inject, injectable } from "inversify";
import { ContainerTypes } from "../container-types";
import { IConfig } from "../config/config.interface";
import { ConfigKeys } from "../config/config-keys";
import { ProductUrlTypes } from "../product-url/product-url-types";

@injectable()
export class ParserService {
  private readonly userAgent: string;
  constructor(@inject(ContainerTypes.Config) private readonly config: IConfig) {
    this.userAgent = config.get(ConfigKeys.USER_AGENT);
  }

  async parseProduct(urlType: ProductUrlTypes, productUrl: string): Promise<number> {
    try {
      switch (urlType) {
        case ProductUrlTypes.GLOBUS: {
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

          return price;
        }
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
