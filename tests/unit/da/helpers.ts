import { IAdvertisement } from "../../../src/interfaces/IAdvertisement";
import { IRent } from "../../../src/interfaces/IRent";
import { IUser } from "../../../src/interfaces/IUser";

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
      id: this.buildString(30),
      login: this.buildString(30),
      password: this.buildString(30),
      score: 0,
      role,
    };
  }

  public buildAdvertisement(ownerId: string): IAdvertisement {
    return {
      id: this.buildString(30),
      description: this.buildString(30),
      isApproved: true,
      cost: 300,
      score: 1,
      address: this.buildString(30),
      ownerId,
    };
  }

  public buildRent(userId: string, adId: string): IRent {
    return {
      id: this.buildString(30),
      adId,
      userId,
      dateFrom: new Date(),
      dateUntil: new Date(),
    };
  }
}
