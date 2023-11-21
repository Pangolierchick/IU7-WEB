import { PrismaClient } from "@prisma/client";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import {
  IAdvertisement,
  IAdvertisementWithOwner,
} from "../interfaces/IAdvertisement";
import { IAdvertisementRepository } from "../interfaces/IAdvertisementRepository";
import { ReadOnlyError } from "../models/errors/generalErrors";

export class AdvertisementRepository implements IAdvertisementRepository {
  private prisma: PrismaClient;
  private convert = (
    ad: IAdvertisement & {
      user: { id: string; login: string; score: number };
    }
  ) => {
    const convertedAd: IAdvertisementWithOwner = {
      ownerScore: ad.user.score,
      login: ad.user.login,
      ...ad,
    };

    delete (convertedAd as any).user;

    return convertedAd;
  };

  constructor(_prisma: PrismaClient) {
    this.prisma = _prisma;
  }

  async get(id: string): Promise<IAdvertisement | null> {
    return this.prisma.advertisement.findFirst({ where: { id } });
  }

  async getAll(): Promise<IAdvertisement[]> {
    return this.prisma.advertisement.findMany({ orderBy: { address: "asc" } });
  }

  async update(newAdv: Partial<IAdvertisement>): Promise<void> {
    if (!newAdv.id) {
      throw new Error("Field id is required");
    }

    try {
      await this.prisma.advertisement.update({
        data: newAdv,
        where: { id: newAdv.id },
      });
    } catch (e) {
      if (e instanceof PrismaClientUnknownRequestError) {
        throw new ReadOnlyError();
      }
      throw new Error(`Failed to update advertisement with id=${newAdv.id}.`);
    }
  }

  async create(data: IAdvertisement): Promise<void> {
    const d = { ...data, scoreCount: 1 };
    try {
      await this.prisma.advertisement.create({ data: d });
    } catch (e) {
      if (e instanceof PrismaClientUnknownRequestError) {
        throw new ReadOnlyError();
      }
      throw new Error(
        `Failed to create advertisement. ${(e as Error).message}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.advertisement.delete({ where: { id } });
    } catch (e) {
      if (e instanceof PrismaClientUnknownRequestError) {
        throw new ReadOnlyError();
      }
      throw new Error("Failed to delete advertisement");
    }
  }

  async updateScore(id: string, score: number): Promise<void> {
    try {
      await this.prisma.advertisement.update({
        where: { id },
        data: { score },
      });
    } catch (e) {
      throw new Error(
        `Failed to update score of advertisement with id = ${id}`
      );
    }
  }

  async updateDescription(id: string, descr: string): Promise<void> {
    try {
      await this.prisma.advertisement.update({
        where: { id },
        data: { description: descr },
      });
    } catch (e) {
      throw new Error(
        `Failed to update description of advertisement with id = ${id}`
      );
    }
  }

  async updatePrice(id: string, price: number): Promise<void> {
    try {
      await this.prisma.advertisement.update({
        where: { id },
        data: { cost: price },
      });
    } catch (e) {
      throw new Error(
        `Failed to update price of advertisement with id = ${id}`
      );
    }
  }

  async approve(id: string): Promise<void> {
    try {
      await this.prisma.advertisement.update({
        where: { id },
        data: { isApproved: true },
      });
    } catch (e) {
      throw new Error(`Failed to approve advertisement with id = ${id}`);
    }
  }

  async getUsersAdvertisements(userId: string): Promise<IAdvertisement[]> {
    try {
      const ads = await this.prisma.advertisement.findMany({
        where: { ownerId: userId },
      });

      return ads;
    } catch (e) {
      throw new Error("Failed to get users advertisiments");
    }
  }

  async getAllWithOwner(): Promise<IAdvertisementWithOwner[]> {
    const ads = await this.prisma.advertisement.findMany({
      orderBy: { address: "asc" },
      include: {
        user: {
          select: {
            id: true,
            login: true,
            score: true,
          },
        },
      },
    });

    const converted = ads.map((e) => this.convert(e));

    return converted;
  }

  async getWithOwner(id: string): Promise<IAdvertisementWithOwner | null> {
    const ad = await this.prisma.advertisement.findFirst({
      include: {
        user: {
          select: {
            id: true,
            login: true,
            score: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (ad) {
      return this.convert(ad);
    }
    return null;
  }

  async getWithFilter(
    filter: Partial<IAdvertisement>
  ): Promise<IAdvertisement[]> {
    return await this.prisma.advertisement.findMany({ where: { ...filter } });
  }

  async deleteMany(ids: string[]): Promise<number> {
    let i = 0;

    for (const id of ids) {
      await this.prisma.advertisement.delete({ where: { id } });
      i++;
    }

    return i;
  }
}
