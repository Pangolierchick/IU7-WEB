import { v4 as uuidv4 } from "uuid";
import { IAdvertisement } from "../interfaces/IAdvertisement";
import { IAdvertisementRepository } from "../interfaces/IAdvertisementRepository";
import { IRent } from "../interfaces/IRent";
import { IRentRepository } from "../interfaces/IRentRepository";
import { INITIAL_SCORE, UserRole } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import {
  AdvertisementAlreadyBooked,
  AdvertisementNotApprovedError,
  AdvertisementNotFound,
  DeleteAdvertisementRightsError,
  OwnerRentError,
  RentDateError,
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

  public async createAdvertisement(data: AdvertisementToBeApproved) {
    const adv = AdvertisementBuilder.buildAdvertisement(data);
    await this._advertisimentRepository.create(adv);

    return adv.id;
  }

  public async getUsersAdvertisements(userId: string) {
    const ads = await this._advertisimentRepository.getUsersAdvertisements(
      userId
    );

    return ads;
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

  public async addAdvertisement(ad: AdvertisementToBeApproved) {
    const user = await this._userRepository.get(ad.ownerId);

    if (user === null) {
      throw new UserNotFound(ad.ownerId);
    }

    const _ad = AdvertisementBuilder.buildAdvertisement(ad);
    await this._advertisimentRepository.create(_ad);
    return _ad.id;
  }

  public async approveAd(adId: string, adminId: string) {
    const user = await this._userRepository.get(adminId);

    if (user === null) {
      throw new UserNotFound(adminId);
    }

    if (user.role !== UserRole.Admin) {
      throw new UserIsNotAdminError(adId);
    }

    const ad = await this._advertisimentRepository.get(adId);

    if (ad === null) {
      throw new AdvertisementNotFound(adId);
    }

    await this._advertisimentRepository.approve(adId);

    return user.id;
  }

  public async deleteAd(adId: string, userId: string) {
    const user = await this._userRepository.get(userId);
    const ad = await this._advertisimentRepository.get(adId);

    if (user === null) {
      throw new UserNotFound(userId);
    }

    if (ad === null) {
      throw new AdvertisementNotFound(adId);
    }

    if (user.role === UserRole.Admin || userId === ad.ownerId) {
      await this._advertisimentRepository.delete(adId);
    } else {
      throw new DeleteAdvertisementRightsError(userId);
    }
  }

  public async searchAdvertisements(needle: string) {
    const ads = await this._advertisimentRepository.getAllWithOwner();

    if (needle) {
      const city = needle.split(",")[0]; //FIXME: search by city (maybe someday ill fix it)

      const byCity = ads.filter(
        (x) =>
          x.address.split(",")[0].toLowerCase() === city.toLowerCase() &&
          x.isApproved
      );

      return byCity;
    }

    return ads.filter((x) => x.isApproved);
  }

  public async getAdvertisementWithOwner(id: string) {
    const ad = await this._advertisimentRepository.getWithOwner(id);

    if (!ad) {
      throw new AdvertisementNotFound(id);
    }

    return ad;
  }

  public async getAdvertisementsRentDates(id: string) {
    const rents = await this._rentRepository.getAdvertisementRents(id);
    const dates: string[] = [];

    rents.forEach((r) => {
      dates.push(`${r.dateFrom.toISOString()}:${r.dateUntil.toISOString()}`);
    });

    return dates;
  }

  public async getUsersRents(id: string) {
    try {
      const rents = await this._rentRepository.getUsersRents(id);
      return rents;
    } catch (e) {
      throw new Error("Failed to get users rents");
    }
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
