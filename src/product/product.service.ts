import { inject, injectable } from "inversify";
import { ContainerTypes } from "../container-types";
import { QueryExecutorService } from "../query-executor/query-executor.service";
import { Product } from "./product";
import { fromDatabase } from "../query-executor/lib/from-database";
import { ProductFind } from "./product.find";

@injectable()
export class ProductService {
  constructor(
    @inject(ContainerTypes.QueryExecutorService)
    private readonly queryExecutorService: QueryExecutorService,
  ) {}

  async findProduct(find?: ProductFind): Promise<Product[]> {
    try {
      let queryString = "SELECT * from products where true";

      if (find) {
        if (find.userId) {
          queryString += ` and user_id=${find.userId}`;
        }
      }

      const res = await this.queryExecutorService.executeQuery(queryString);

      return res.rows.map((item) => fromDatabase<Product>(item, Product));
    } catch (e) {
      throw e;
    }
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    try {
      const res = await this.queryExecutorService.executeQuery(
        "INSERT INTO products(name, user_id) VALUES($1, $2) RETURNING *",
        [data.name, data.userId],
      );
      return fromDatabase<Product>(res.rows[0], Product);
    } catch (e) {
      throw e;
    }
  }
}
