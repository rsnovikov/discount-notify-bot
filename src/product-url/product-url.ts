import { Column } from "../query-executor/lib/column-decorator";
import { ProductUrlTypes } from "./product-url-types";

// id serial primary key,
// type_id smallint check(type_id in (1)), -- 1 - globus
// url varchar(255) not null,
// created_at timestamptz default now(),
// product_id bigint not null,

export class ProductUrl {
  @Column()
  id!: number;
  @Column("type_id")
  typeId!: ProductUrlTypes;
  @Column()
  url!: string;
  @Column("product_id")
  productId!: number;
  @Column("created_at")
  createdAt!: string;
}
