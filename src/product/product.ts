import { Column } from "../query-executor/lib/column-decorator";

export class Product {
  @Column()
  id!: number;
  @Column()
  name!: string;
  @Column("created_at")
  createdAt!: string;
  @Column("user_id")
  userId!: number;
}
