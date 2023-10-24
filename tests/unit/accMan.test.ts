import { beforeEach, describe, expect, it } from "vitest";
import { UserRole } from "../../src/interfaces/IUser";
import { userModel } from "../../src/models/userModel";
import { DataMock } from "../mocks/dataMock";
import { UserMock } from "../mocks/userMock";

let userRepo: UserMock;
let accountManager: userModel;

describe("Unit tests of accountManager", () => {
  beforeEach(() => {
    userRepo = new UserMock(DataMock.users());
    accountManager = new userModel(userRepo);
  });

  it("check existing user", async () => {
    expect(await accountManager.checkUser("1")).toBe(true);
  });

  it("add regular user", async () => {
    const id = await accountManager.addUser("newL", "newP");
    const user = await userRepo.get(id);
    expect(user).toBeDefined();
    expect(user?.role).toBe(UserRole.User);
  });

  it("add admin", async () => {
    const id = await accountManager.addAdmin("newL", "newP");
    const user = await userRepo.get(id);
    expect(user).toBeDefined();
    expect(user?.role).toBe(UserRole.Admin);
  });

  it("[NEGATIVE] check unexisting user", async () => {
    expect(await accountManager.checkUser("1000")).toBe(false);
  });
});
