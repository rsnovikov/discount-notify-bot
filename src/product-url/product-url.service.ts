import { inject, injectable } from "inversify";
import { ContainerTypes } from "../container-types";
import { QueryExecutorService } from "../query-executor/query-executor.service";
import { ProductUrl } from "./product-url";
import { fromDatabase } from "../query-executor/lib/from-database";

@injectable()
export class ProductUrlService {
  constructor(
    @inject(ContainerTypes.QueryExecutorService)
    private readonly queryExecutorService: QueryExecutorService,
  ) {}

  async create(data: Partial<ProductUrl>): Promise<ProductUrl> {
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
}
