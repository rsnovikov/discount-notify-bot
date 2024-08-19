import { inject, injectable } from "inversify";
import { ContainerTypes } from "../container-types";
import { QueryExecutorService } from "../query-executor/query-executor.service";
import { fromDatabase } from "../query-executor/lib/from-database";
import { ProductPrice } from "./product-price";

@injectable()
export class ProductPriceService {
  constructor(
    @inject(ContainerTypes.QueryExecutorService)
    private readonly queryExecutorService: QueryExecutorService,
  ) {}

  async create(data: Partial<ProductPrice>): Promise<ProductPrice> {
    try {
      const res = await this.queryExecutorService.executeQuery(
        "INSERT INTO product_prices(price, product_url_id) VALUES($1, $2) RETURNING *",
        [data.price, data.productUrlId],
      );
      return fromDatabase<ProductPrice>(res.rows[0], ProductPrice);
    } catch (e) {
      throw e;
    }
  }
}
