import { IUser } from "../../../src/interfaces/IUser";
import prisma from "../../../src/prismaInstance";
import { UserRepository } from "../../../src/repositories/userRepository";
import { TestBuilder } from "../../helpers";

const userRepo = new UserRepository(prisma);

const builder = new TestBuilder();

describe("User repository unit tests", () => {
  test("create & get", async () => {
    const user = builder.buildUser();

    await userRepo.create(user);

    expect(await userRepo.get(user.id)).toStrictEqual({
      ...user,
      scoreCount: 1,
    });
  });

  test("delete", async () => {
    const user = builder.buildUser();

    await userRepo.create(user);
    await userRepo.delete(user.id);

    expect(await userRepo.get(user.id)).toBeNull;
  });

  test("update", async () => {
    const user = builder.buildUser();

    const newUser: IUser = {
      ...user,
      login: builder.buildString(),
      password: builder.buildString(),
    };

    await userRepo.create(user);
    await userRepo.update(newUser);

    expect(await userRepo.get(user.id)).toStrictEqual({
      ...newUser,
      scoreCount: 1,
    });
  });

  test("getWithFilter", async () => {
    const user = builder.buildUser();

    await userRepo.create(user);

    const actual = await userRepo.getWithFilter({ login: user.login });

    expect(actual).toStrictEqual([{ ...user, scoreCount: 1 }]);
  });

  test("getByLogin", async () => {
    const user = builder.buildUser();

    await userRepo.create(user);

    const actual = await userRepo.getByLogin(user.login);

    expect(actual).toStrictEqual({ ...user, scoreCount: 1 });
  });
});
