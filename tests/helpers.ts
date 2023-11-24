import { v4 as uuid } from "uuid";
import { IAdvertisement } from "../src/interfaces/IAdvertisement";
import { IRent } from "../src/interfaces/IRent";
import { IUser, UserRole } from "../src/interfaces/IUser";

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export class TestBuilder {
  public buildString(length = 30): string {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
  public buildUser(role = 0): IUser {
    return {
      id: uuid(),
      login: this.buildString(30),
      password: this.buildString(30),
      score: 0,
      role,
    };
  }

  public buildUserWith(user: Partial<IUser>): IUser {
    return {
      id: user.id ?? uuid(),
      login: user.login ?? this.buildString(30),
      password: user.password ?? this.buildString(30),
      score: user.score ?? 0,
      role: user.role ?? UserRole.User,
    };
  }

  public buildAdvertisement(ownerId: string): IAdvertisement {
    return {
      id: uuid(),
      description: this.buildString(30),
      isApproved: true,
      cost: 300,
      score: 1,
      address: this.buildString(30),
      ownerId,
    };
  }

  public buildAdvertisementWith(
    ad: AtLeast<IAdvertisement, "ownerId">
  ): IAdvertisement {
    return {
      id: ad.id ?? uuid(),
      description: ad.description ?? this.buildString(30),
      isApproved: ad.isApproved ?? true,
      cost: ad.cost ?? 300,
      score: ad.score ?? 1,
      address: ad.address ?? this.buildString(30),
      ownerId: ad.ownerId,
    };
  }

  public buildRent(userId: string, adId: string): IRent {
    const df = new Date();
    const du = new Date();

    df.setFullYear(df.getFullYear() + 1);
    du.setFullYear(du.getFullYear() + 1);

    return {
      id: uuid(),
      adId,
      userId,
      dateFrom: df,
      dateUntil: du,
    };
  }

  public buildRentWith(rent: AtLeast<IRent, "adId" | "userId">): IRent {
    const df = new Date();
    const du = new Date();

    df.setFullYear(df.getFullYear() + 1);
    du.setFullYear(du.getFullYear() + 1);

    return {
      id: rent.id ?? uuid(),
      adId: rent.adId,
      userId: rent.userId,
      dateFrom: rent.dateFrom ?? df,
      dateUntil: rent.dateUntil ?? du,
    };
  }
}
