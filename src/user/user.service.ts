import { inject, injectable } from "inversify";
import { ContainerTypes } from "../container-types";
import { QueryExecutorService } from "../query-executor/query-executor.service";
import { User } from "./user";
import { fromDatabase } from "../query-executor/lib/from-database";

@injectable()
export class UserService {
  constructor(
    @inject(ContainerTypes.QueryExecutorService)
    private readonly queryExecutorService: QueryExecutorService,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    try {
      const res = await this.queryExecutorService.executeQuery("INSERT INTO users(tg_id) VALUES($1) RETURNING *", [
        data.tgId,
      ]);
      return fromDatabase<User>(res.rows[0], User);
    } catch (e) {
      throw e;
    }
  }

  async getByTgId(tgId: User["tgId"]): Promise<User> {
    try {
      const res = await this.queryExecutorService.executeQuery("SELECT * FROM users WHERE tg_id=$1", [tgId]);

      return fromDatabase<User>(res.rows[0], User);
    } catch (e) {
      throw e;
    }
  }
}
