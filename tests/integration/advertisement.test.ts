import { AdvertisementModel } from "../../src/models/advertisementModel";
import { userModel } from "../../src/models/userModel";
import prisma from "../../src/prismaInstance";
import { AdvertisementRepository } from "../../src/repositories/advertisimentRepository";
import { RentRepository } from "../../src/repositories/rentRepository";
import { UserRepository } from "../../src/repositories/userRepository";
import { TestBuilder } from "../helpers";

const userRepo = new UserRepository(prisma);
const adRepo = new AdvertisementRepository(prisma);
const rentRepo = new RentRepository(prisma);
const builder = new TestBuilder();

const usrModel = new userModel(userRepo);
const adModel = new AdvertisementModel(adRepo, userRepo, rentRepo);

describe("Advertisements tests", () => {
  afterEach(async () => {
    await prisma.$transaction([
      prisma.rent.deleteMany(),
      prisma.advertisement.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  test("Create advertisement", async () => {
    const userId = await usrModel.addUser(
      builder.buildString(),
      builder.buildString()
    );
    const ad = builder.buildAdvertisementWith({ ownerId: userId });
    const adId = await adModel.createAdvertisement(ad);

    expect(await userRepo.get(userId)).not.toBeNull();
    expect(await adRepo.get(adId)).not.toBeNull();
  });

  test("Get with filter", async () => {
    const userId1 = await usrModel.addUser(
      builder.buildString(),
      builder.buildString()
    );

    const userId2 = await usrModel.addUser(
      builder.buildString(),
      builder.buildString()
    );

    const adsId = [];
    const userId = [userId1, userId2];

    for (let i = 0; i < 6; i++) {
      const ad = builder.buildAdvertisementWith({ ownerId: userId[i % 2] });
      const adId = await adModel.createAdvertisement(ad);
      adsId.push(adId);
    }

    const actualAds = await adModel.getAdvertisementsWithFilter({
      ownerId: userId2,
    });

    const actualIds = actualAds.map((v) => v.id);

    expect(actualIds).toStrictEqual(adsId.filter((v, i) => i % 2));
  });

  test("Delete", async () => {
    const userId = await usrModel.addUser(
      builder.buildString(),
      builder.buildString()
    );

    const ad = builder.buildAdvertisementWith({ ownerId: userId });
    const adId = await adModel.createAdvertisement(ad);

    expect(await adModel.getAdvertisement(adId)).not.toBeNull();

    await adModel.deleteAdvertisements(userId, [adId]);

    await expect(adModel.getAdvertisement(adId)).rejects.toThrow("not found");
  });

  test("Create & get rent", async () => {
    const adminId = await usrModel.addAdmin(
      builder.buildString(),
      builder.buildString()
    );

    const userId = await usrModel.addUser(
      builder.buildString(),
      builder.buildString()
    );

    const actualAdmin = await usrModel.getUsersWithFilters({ id: adminId });
    expect(actualAdmin[0]).toBeDefined();
    expect(actualAdmin[0].id).toBe(adminId);

    const ad = builder.buildAdvertisementWith({ ownerId: adminId });
    const adId = await adModel.createAdvertisement(ad);

    await adModel.updateAdvertisement(adminId, { id: adId, isApproved: true });

    const actualAd = await adModel.getAdvertisement(adId);
    expect(actualAd.isApproved).toBe(true);

    const rent = builder.buildRentWith({ userId: userId, adId });
    const rentId = await adModel.newRent(
      rent.adId,
      rent.userId,
      rent.dateFrom,
      rent.dateUntil
    );

    const actualRent = await adModel.getRents({ id: rentId });

    expect(actualRent.length).toBe(1);
    expect(actualRent[0]).toStrictEqual({
      id: rentId,
      adId,
      userId: userId,
      dateFrom: rent.dateFrom,
      dateUntil: rent.dateUntil,
    });
  });
});
