import { inject, injectable } from "inversify";
import { TYPES } from "../TYPES";
import { QueryExecutorService } from "../query-executor/query-executor.service";
import { IUser } from "./user.interface";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.QueryExecutorService)
    private readonly queryExecutorService: QueryExecutorService,
  ) {}

  async create(data: Partial<IUser>): Promise<IUser> {
    try {
      const res = await this.queryExecutorService.executeQuery(
        "INSERT INTO users(tg_id) VALUES($1) RETURNING *",
        [data.tgId],
      );
      console.log(res.rows);
      return res.rows[0] as IUser;
    } catch (e) {
      throw e;
    }
  }
}
