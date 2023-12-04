import { v4 as uuidv4 } from "uuid";
import { IAdvertisement } from "../interfaces/IAdvertisement";
import { IAdvertisementRepository } from "../interfaces/IAdvertisementRepository";
import { IRent } from "../interfaces/IRent";
import { IRentRepository } from "../interfaces/IRentRepository";
import { INITIAL_SCORE, UserRole } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { AtLeast } from "../misc";
import {
  AdvertisementAlreadyBooked,
  AdvertisementNotApprovedError,
  AdvertisementNotFound,
  AdvertisementRightsError,
  OwnerRentError,
  RentDateError,
  RentNotFound,
  UpdateAdvertisementRightsError,
} from "./errors/advertisementErrors";
import { UserIsNotAdminError, UserNotFound } from "./errors/userErrors";

type AdvertisementToBeApproved = {
  description: string;
  cost: number;
  address: string;
  ownerId: string;
};

export class AdvertisementModel {
  private _advertisimentRepository: IAdvertisementRepository;

  private _userRepository: IUserRepository;

  private _rentRepository: IRentRepository;

  constructor(
    adRepo: IAdvertisementRepository,
    userRepo: IUserRepository,
    rentRepo: IRentRepository
  ) {
    this._advertisimentRepository = adRepo;
    this._userRepository = userRepo;
    this._rentRepository = rentRepo;
  }

  public async getAdvertisement(adId: string) {
    const ad = await this._advertisimentRepository.get(adId);

    if (!ad) {
      throw new AdvertisementNotFound(adId);
    }

    return ad;
  }

  public async getRent(id: string) {
    const rent = await this._rentRepository.get(id);

    if (!rent) {
      throw new RentNotFound();
    }

    return rent;
  }

  public async deleteAdvertisements(userId: string, ids: string[]) {
    const user = await this._userRepository.get(userId);

    if (!user) {
      throw new UserNotFound(userId);
    }

    for (const adId of ids) {
      const ad = await this.getAdvertisement(adId);

      if (ad.ownerId === user.id || user.role === UserRole.Admin) {
        await this._advertisimentRepository.delete(adId);
      } else {
        throw new AdvertisementRightsError(userId);
      }
    }
  }

  public async updateAdvertisement(
    userId: string,
    ad: AtLeast<IAdvertisement, "id">
  ) {
    const adv = await this._advertisimentRepository.get(ad.id);

    if (adv === null) {
      throw new AdvertisementNotFound(ad.id);
    }

    const user = await this._userRepository.get(userId);

    if (user === null) {
      throw new UserNotFound();
    }

    if (ad.isApproved !== undefined && user.role !== UserRole.Admin) {
      throw new UserIsNotAdminError(ad.id);
    }

    if (user.role === UserRole.Admin || adv.ownerId === userId) {
      await this._advertisimentRepository.update(ad);
      return await this.getAdvertisement(ad.id);
    }

    throw new UpdateAdvertisementRightsError(ad.ownerId);
  }

  public async createAdvertisement(data: AdvertisementToBeApproved) {
    const adv = AdvertisementBuilder.buildAdvertisement(data);
    await this._advertisimentRepository.create(adv);

    return adv.id;
  }

  public async newRent(adId: string, userId: string, from: Date, to: Date) {
    const user = await this._userRepository.get(userId);
    const ad = await this._advertisimentRepository.get(adId);

    if (from > to) {
      [from, to] = [to, from];
    }

    const today = new Date();

    if (from < today) {
      throw new RentDateError();
    }

    if (user === null) {
      throw new UserNotFound(userId);
    }

    if (ad === null) {
      throw new AdvertisementNotFound(adId);
    }

    if (userId === ad.ownerId) {
      throw new OwnerRentError();
    }

    if (!ad.isApproved) {
      throw new AdvertisementNotApprovedError(adId);
    }

    const rents = await this._rentRepository.getInDate(adId, from, to);

    if (rents.length !== 0) {
      throw new AdvertisementAlreadyBooked();
    }

    const rent = RentBuilder.buildRent(adId, userId, from, to);
    await this._rentRepository.create(rent);

    return rent.id;
  }

  public async getRents(filters: Partial<IRent>) {
    return await this._rentRepository.getWithFilters(filters);
  }

  public async getAdvertisementsWithFilter(filter: Partial<IAdvertisement>) {
    return await this._advertisimentRepository.getWithFilter(filter);
  }
}

class RentBuilder {
  public static buildRent(
    adId: string,
    userId: string,
    from: Date,
    to: Date
  ): IRent {
    return {
      id: uuidv4(),
      adId: adId,
      userId: userId,
      dateFrom: from,
      dateUntil: to,
    };
  }
}

class AdvertisementBuilder {
  public static buildAdvertisement(
    ad: AdvertisementToBeApproved
  ): IAdvertisement {
    return {
      id: uuidv4(),
      description: ad.description,
      ownerId: ad.ownerId,
      cost: ad.cost,
      address: ad.address,
      score: INITIAL_SCORE,
      isApproved: false,
    };
  }
}
