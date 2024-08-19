import { Column } from "../query-executor/lib/column-decorator";

export class ProductPrice {
  @Column()
  id!: number;
  @Column()
  price!: number;
  @Column("product_url_id")
  productUrlId!: number;
  @Column("created_at")
  createdAt!: string;
}
