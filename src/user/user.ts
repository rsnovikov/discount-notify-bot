import { Column } from "../query-executor/lib/column-decorator";

export class User {
  @Column()
  id!: number;
  @Column("tg_id")
  tgId!: number;
  @Column("created_at")
  createdAt!: string;
}
