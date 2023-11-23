import { PrismaClient } from "@prisma/client";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { IAdvertisement } from "../interfaces/IAdvertisement";
import { IAdvertisementRepository } from "../interfaces/IAdvertisementRepository";
import { ReadOnlyError } from "../models/errors/generalErrors";

export class AdvertisementRepository implements IAdvertisementRepository {
  private prisma: PrismaClient;

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

  async getWithFilter(
    filter: Partial<IAdvertisement>
  ): Promise<IAdvertisement[]> {
    return await this.prisma.advertisement.findMany({ where: { ...filter } });
  }
}
