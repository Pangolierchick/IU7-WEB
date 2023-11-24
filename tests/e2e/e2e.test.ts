import request from "supertest";
import app from "../../src/index";
import { UserModel } from "../../src/models/userModel";
import prisma from "../../src/prismaInstance";
import { UserRepository } from "../../src/repositories/userRepository";
import { TestBuilder } from "../helpers";

describe("E2E test suite", () => {
  const builder = new TestBuilder();
  let adminId: string;
  afterEach(async () => {
    await prisma.$transaction([
      prisma.rent.deleteMany(),
      prisma.advertisement.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  });

  beforeEach(async () => {
    const usrRepo = new UserRepository(prisma);
    const usrModel = new UserModel(usrRepo);

    const rawusr = builder.buildUser();
    adminId = await usrModel.addAdmin(rawusr.login, rawusr.password);
  });

  it("e2e test", async () => {
    const user = builder.buildUser();

    const signupRes = await request(app)
      .post("/api/v1/auth")
      .send({ login: user.login, password: user.password });

    expect(signupRes.statusCode).toBe(200);

    const userId = JSON.parse(signupRes.text).userId;
    expect(userId).toBeDefined();

    const authRes = await request(app)
      .get(`/api/v1/auth`)
      .query({ login: user.login })
      .query({ password: user.password })
      .send();

    expect(authRes.statusCode).toBe(200);
    const token = JSON.parse(authRes.text).token;
    expect(token).toBeDefined();

    const rawad = builder.buildAdvertisement(userId);
    const advRes = await request(app)
      .post("/api/v1/listings")
      .auth(token, { type: "bearer" })
      .send({
        address: rawad.address,
        cost: rawad.cost,
        description: rawad.description,
      });

    expect(advRes.statusCode).toBe(201);
    const adId = JSON.parse(advRes.text).id;
    expect(adId).toBeDefined();
  });

  afterAll(() => {
    const server = app.listen();
    server.close();
  });
});
