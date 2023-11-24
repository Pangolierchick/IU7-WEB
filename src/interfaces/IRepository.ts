import { AtLeast } from "../misc";

interface WithId {
  id: string;
}
export interface IRepository<T extends WithId> {
  getAll(): Promise<T[]>;
  get(id: string): Promise<T | null>;
  create(data: T): Promise<void>;
  delete(id: string): Promise<void>;
  update(n: AtLeast<T, "id">): Promise<void>;
}
