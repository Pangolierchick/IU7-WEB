import { AdvertisementModel } from "../src/models/advertisementModel";
import { UserModel } from "../src/models/userModel";
import prisma from "../src/prismaInstance";
import { AdvertisementRepository } from "../src/repositories/advertisimentRepository";
import { RentRepository } from "../src/repositories/rentRepository";
import { UserRepository } from "../src/repositories/userRepository";
import { buildString } from "./benchmarkHelpers";
import { BenchRunner } from "./runner";

const runner = new BenchRunner({ export: true });

const userRepo = new UserRepository(prisma);
const advRepo = new AdvertisementRepository(prisma);
const rentRepo = new RentRepository(prisma);

const advModel = new AdvertisementModel(advRepo, userRepo, rentRepo);
const userModel = new UserModel(userRepo);

runner.add("Insert", async () => {
  const login = buildString();
  const password = buildString();
  await userModel.addUser(login, password);
});

runner.add("Get all", async () => {
  await userModel.getUsersWithFilters({});
});

runner.add("Delete", async () => {
  const login = buildString();
  const password = buildString();
  const id = await userModel.addUser(login, password);

  await userRepo.delete(id);
});

runner.add("Create advertisement", async () => {
  const login = buildString();
  const password = buildString();

  const id = await userModel.addUser(login, password);

  const description = buildString(100);
  const address = buildString(100);

  await advModel.createAdvertisement({
    description,
    address,
    cost: 100,
    ownerId: id,
  });
});

runner.run().then();
