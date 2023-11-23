import { IRepository } from "./IRepository";
import { IUser } from "./IUser";

export interface IUserRepository extends IRepository<IUser> {
  getByLogin(login: string): Promise<IUser | null>;
  getWithFilter(filters: Partial<IUser>): Promise<IUser[]>;
}
