import request from "supertest";
import app from "../../src/index";
import { IUser } from "../../src/interfaces/IUser";
import { UserModel } from "../../src/models/userModel";
import prisma from "../../src/prismaInstance";
import { UserRepository } from "../../src/repositories/userRepository";
import { TestBuilder } from "../helpers";

describe("E2E test suite", () => {
  const builder = new TestBuilder();
  let adminId: string;
  let rawusr: IUser;

  beforeEach(async () => {
    const usrRepo = new UserRepository(prisma);
    const usrModel = new UserModel(usrRepo);

    rawusr = builder.buildUser();
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

    const adminAuth = await request(app)
      .get(`/api/v1/auth`)
      .query({ login: rawusr.login })
      .query({ password: rawusr.password })
      .send();

    expect(adminAuth.statusCode).toBe(200);
    const adminToken = JSON.parse(adminAuth.text).token;
    expect(adminToken).toBeDefined();

    const advApprove = await request(app)
      .patch("/api/v1/listings")
      .auth(adminToken, { type: "bearer" })
      .query({ id: adId })
      .send({ isApproved: true });

    expect(advApprove.statusCode).toBe(200);
    expect(JSON.parse(advApprove.text).advertisement.isApproved).toBe(true);

    const from = new Date();
    from.setFullYear(from.getFullYear() + 1);
    const to = new Date();
    to.setFullYear(to.getFullYear() + 1);
    to.setMonth(to.getMonth() + 1);

    const rentRes = await request(app)
      .post("/api/v1/rents")
      .auth(adminToken, { type: "bearer" })
      .query({ adId })
      .send({ from: from.toISOString(), to: to.toISOString() });

    expect(rentRes.statusCode).toBe(201);
    expect(JSON.parse(rentRes.text).id).toBeDefined();
  });

  afterAll(() => {
    const server = app.listen();
    server.close();
  });
});
