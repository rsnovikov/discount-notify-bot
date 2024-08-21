import { inject, injectable } from "inversify";
import { ContainerTypes } from "../container-types";
import { QueryExecutorService } from "../query-executor/query-executor.service";
import { ProductUrl } from "./product-url";
import { fromDatabase } from "../query-executor/lib/from-database";
import { CronJob } from "cron";
import { REQUESTS_PER_SECOND_LIMIT } from "../constants";
import { ParserService } from "../parser/parser.service";

@injectable()
export class ProductUrlService {
  private getPricesJon!: CronJob;
  constructor(
    @inject(ContainerTypes.QueryExecutorService)
    private readonly queryExecutorService: QueryExecutorService,
    @inject(ContainerTypes.ParserService) private readonly parserService: ParserService,
  ) {
    this.startGetPrices();
    // this.startGetPriceScheduler();
  }

  async createProductUrl(data: Partial<ProductUrl>): Promise<ProductUrl> {
    try {
      const res = await this.queryExecutorService.executeQuery(
        "INSERT INTO product_urls(type_id, url, product_id) VALUES($1, $2, $3) RETURNING *",
        [data.typeId, data.url, data.productId],
      );
      return fromDatabase<ProductUrl>(res.rows[0], ProductUrl);
    } catch (e) {
      throw e;
    }
  }

  async findProductUrl() {
    try {
      const res = await this.queryExecutorService.executeQuery("SELECT * FROM product_urls");

      return res.rows.map((item) => fromDatabase<ProductUrl>(item, ProductUrl));
    } catch (e) {
      throw e;
    }
  }

  private startGetPriceScheduler() {
    this.getPricesJon = new CronJob("11 21 * * *", this.startGetPrices.bind(this), null, true, "Europe/Moscow");
  }

  private async startGetPrices() {
    try {
      const productUrlList = await this.findProductUrl();

      const results = await Promise.allSettled(
        productUrlList.map(async (productUrl, index) => {
          const price = await new Promise((resolve, reject) => {
            try {
              setTimeout(
                () => {
                  resolve(this.parserService.parseProduct(productUrl.typeId, productUrl.url));
                },
                1000 * (index / REQUESTS_PER_SECOND_LIMIT),
              );
            } catch (e) {
              reject(e);
            }
          });

          return {
            productUrlId: productUrl.id,
            price,
          };
        }),
      );

      console.log(results);
    } catch (e) {
      console.error(e);
    }
  }
}
