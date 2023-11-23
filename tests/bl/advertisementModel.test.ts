import { MockProxy, mock } from "jest-mock-extended";
import { IAdvertisementRepository } from "../../src/interfaces/IAdvertisementRepository";
import { IRentRepository } from "../../src/interfaces/IRentRepository";
import { IUserRepository } from "../../src/interfaces/IUserRepository";
import { AdvertisementModel } from "../../src/models/advertisementModel";
import { TestBuilder } from "../da/helpers";

describe("advertisementModel tests (mocks)", () => {
  let userRepo: MockProxy<IUserRepository>;
  let advRepo: MockProxy<IAdvertisementRepository>;
  let rentRepo: MockProxy<IRentRepository>;

  let _advModel: AdvertisementModel;

  beforeEach(() => {
    userRepo = mock<IUserRepository>();
    advRepo = mock<IAdvertisementRepository>();
    rentRepo = mock<IRentRepository>();

    _advModel = new AdvertisementModel(advRepo, userRepo, rentRepo);
  });

  it("getAdvertisement", async () => {
    const builder = new TestBuilder();
    const user = builder.buildUser();
    const adv = builder.buildAdvertisement(user.id);

    advRepo.get.calledWith(adv.id).mockResolvedValue(adv);

    const sut = await _advModel.getAdvertisement(adv.id);

    expect(advRepo.get).toHaveBeenCalledTimes(1);
    expect(advRepo.get).toHaveBeenCalledWith(adv.id);
    expect(sut).toStrictEqual(adv);
  });

  it("[negative] getAdvertisement", async () => {
    const builder = new TestBuilder();
    const user = builder.buildUser();
    const adv = builder.buildAdvertisement(user.id);

    advRepo.get.calledWith(adv.id).mockResolvedValue(null);

    const sut = _advModel.getAdvertisement(adv.id);

    await expect(sut).rejects.toThrow("not found");
    expect(advRepo.get).toHaveBeenCalledTimes(1);
    expect(advRepo.get).toHaveBeenCalledWith(adv.id);
  });

  it("createAdvertisement", async () => {
    const builder = new TestBuilder();
    const user = builder.buildUser();
    const adv = builder.buildAdvertisement(user.id);

    await _advModel.createAdvertisement({ ...adv });
    expect(advRepo.create).toHaveBeenCalled();
  });

  it("deleteAdvertisements", async () => {
    const builder = new TestBuilder();
    const user = builder.buildUser();
    const ads = [0, 0, 0, 0].map(() => builder.buildAdvertisement(user.id));

    ads.forEach((ad) => {
      advRepo.get.calledWith(ad.id).mockResolvedValue(ad);
    });

    userRepo.get.calledWith(user.id).mockResolvedValue(user);

    await _advModel.deleteAdvertisements(
      user.id,
      ads.map((x) => x.id)
    );

    expect(advRepo.delete).toHaveBeenCalledTimes(4);
  });
});
