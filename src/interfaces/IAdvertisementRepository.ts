import { IAdvertisement } from "./IAdvertisement";
import { IRepository } from "./IRepository";

export interface IAdvertisementRepository extends IRepository<IAdvertisement> {
  getWithFilter(filter: Partial<IAdvertisement>): Promise<IAdvertisement[]>;
}
