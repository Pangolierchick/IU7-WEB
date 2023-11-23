import { PrismaClient } from "@prisma/client";
import { IAdvertisement } from "../../src/interfaces/IAdvertisement";
import { IUser } from "../../src/interfaces/IUser";
import { AdvertisementRepository } from "../../src/repositories/advertisimentRepository";
import { RentRepository } from "../../src/repositories/rentRepository";
import { UserRepository } from "../../src/repositories/userRepository";
import { TestBuilder } from "./helpers";

const prisma: PrismaClient = new PrismaClient();
const rentRepo = new RentRepository(prisma);
const userRepo = new UserRepository(prisma);
const advRepo = new AdvertisementRepository(prisma);

let builder: TestBuilder;
let user: IUser;
let ad: IAdvertisement;

describe("Rent repository unit tests", () => {
  beforeEach(async () => {
    builder = new TestBuilder();

    user = builder.buildUser();
    ad = builder.buildAdvertisement(user.id);

    await userRepo.create(user);
    await advRepo.create(ad);
  });
  it("create & get", async () => {
    const rent = builder.buildRent(user.id, ad.id);

    await rentRepo.create(rent);

    expect(await rentRepo.get(rent.id)).toStrictEqual(rent);
  });

  it("update", async () => {
    const rent = builder.buildRent(user.id, ad.id);
    await rentRepo.create(rent);

    const newRent = {
      id: rent.id,
      userId: rent.userId,
      adId: rent.adId,
      dateFrom: new Date("10-11-2021"),
      dateUntil: new Date("10-11-2022"),
    };

    await rentRepo.update(newRent);

    const actual = await rentRepo.get(rent.id);

    expect(actual).toStrictEqual(newRent);
  });

  it("delete", async () => {
    const rent = builder.buildRent(user.id, ad.id);
    await rentRepo.create(rent);

    await rentRepo.delete(rent.id);

    expect(await rentRepo.get(rent.id)).toBeNull();
  });
});
