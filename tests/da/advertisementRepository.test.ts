import { PrismaClient } from "@prisma/client";
import { IAdvertisement } from "../../src/interfaces/IAdvertisement";
import { IUser } from "../../src/interfaces/IUser";
import { AdvertisementRepository } from "../../src/repositories/advertisimentRepository";
import { UserRepository } from "../../src/repositories/userRepository";
import { TestBuilder } from "./helpers";

const prisma: PrismaClient = new PrismaClient();
const userRepo = new UserRepository(prisma);
const advRepo = new AdvertisementRepository(prisma);

let builder: TestBuilder;
let user: IUser;

describe("Advertisement repository unit tests", () => {
  beforeEach(async () => {
    builder = new TestBuilder();

    user = builder.buildUser();
    await userRepo.create(user);
  });

  test("create & get", async () => {
    const ad = builder.buildAdvertisement(user.id);
    await advRepo.create(ad);

    const actual = await advRepo.get(ad.id);

    expect(actual).toStrictEqual({ ...actual, scoreCount: 1 });
  });

  test("delete", async () => {
    const ad = builder.buildAdvertisement(user.id);
    await advRepo.create(ad);

    await advRepo.delete(ad.id);

    const actual = await advRepo.get(ad.id);

    expect(actual).toBeNull();
  });

  test("update", async () => {
    const ad = builder.buildAdvertisement(user.id);
    await advRepo.create(ad);

    const newAd: IAdvertisement = {
      ...ad,
      address: "testAddress",
    };

    await advRepo.update(newAd);
    const actual = await advRepo.get(ad.id);

    expect(actual).toStrictEqual({ ...newAd, scoreCount: 1 });
  });

  test("getWithFilter", async () => {
    const user2 = builder.buildUser();
    await userRepo.create(user2);

    const nads = [];

    for (let i = 0; i < 5; i++) {
      const nad = builder.buildAdvertisement(user2.id);
      await advRepo.create(nad);

      nads.push({ ...nad, scoreCount: 1 });
    }

    const actual = await advRepo.getWithFilter({ ownerId: user2.id });

    expect(nads).toStrictEqual(actual);
  });
});
