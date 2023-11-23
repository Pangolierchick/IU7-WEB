import { MockProxy, captor, mock } from "jest-mock-extended";
import { UserRole } from "../../src/interfaces/IUser";
import { IUserRepository } from "../../src/interfaces/IUserRepository";
import { userModel } from "../../src/models/userModel";
import { TestBuilder } from "../da/helpers";

describe("userModel tests (mocks)", () => {
  let userRepo: MockProxy<IUserRepository>;
  let _userModel: userModel;

  beforeEach(() => {
    userRepo = mock<IUserRepository>();
    _userModel = new userModel(userRepo);
  });

  test("addUser", async () => {
    await _userModel.addUser("test", "test");

    expect(userRepo.create).toHaveBeenCalledTimes(1);
    const argCapt = captor();
    expect(userRepo.create).toHaveBeenCalledWith(argCapt);
    expect(argCapt.value).toHaveProperty("role", UserRole.User);
  });

  test("addAdmin", async () => {
    await _userModel.addAdmin("test", "test");

    expect(userRepo.create).toHaveBeenCalledTimes(1);
    const argCapt = captor();
    expect(userRepo.create).toHaveBeenCalledWith(argCapt);
    expect(argCapt.value).toHaveProperty("role", UserRole.Admin);
  });

  test("[negative] updateUser", async () => {
    const builder = new TestBuilder();
    const user = builder.buildUser();

    userRepo.get.calledWith(user.id).mockResolvedValue(null);

    const actual = _userModel.updateUser(user);
    await expect(actual).rejects.toThrow("not found");
  });

  test("updateUser", async () => {
    const builder = new TestBuilder();
    const user = builder.buildUser();

    userRepo.get.calledWith(user.id).mockResolvedValue(user);

    await _userModel.updateUser(user);

    expect(userRepo.update).toHaveBeenCalledTimes(1);
    expect(userRepo.update).toHaveBeenCalledWith(user);
  });
});
