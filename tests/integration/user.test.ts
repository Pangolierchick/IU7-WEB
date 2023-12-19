import { UserRole } from "../../src/interfaces/IUser";
import { UserModel } from "../../src/models/userModel";
import prisma from "../../src/prismaInstance";
import { UserRepository } from "../../src/repositories/userRepository";
import { TestBuilder } from "../helpers";

const userRepo = new UserRepository(prisma);
const builder = new TestBuilder();

const usrModel = new UserModel(userRepo);

describe("Users tests", () => {
  it("create & get user", async () => {
    const userId = await usrModel.addUser(
      builder.buildString(),
      builder.buildString()
    );

    const actual = await usrModel.getUsersWithFilters({ id: userId });

    expect(actual.length).toBe(1);
    expect(actual[0].role).toBe(UserRole.User);
    expect(actual[0].id).toBe(userId);
  });

  it("create & get admin", async () => {
    const userId = await usrModel.addAdmin(
      builder.buildString(),
      builder.buildString()
    );

    const actual = await usrModel.getUsersWithFilters({ id: userId });

    expect(actual.length).toBe(1);
    expect(actual[0].role).toBe(UserRole.Admin);
    expect(actual[0].id).toBe(userId);
  });

  it("Update user", async () => {
    const userId = await usrModel.addUser(
      builder.buildString(),
      builder.buildString()
    );

    const newLogin = builder.buildString();

    await usrModel.updateUser({ id: userId, login: newLogin });

    const users = await usrModel.getUsersWithFilters({ id: userId });

    expect(users.length).toBe(1);
    expect(users[0].login).toBe(newLogin);
  });
});
