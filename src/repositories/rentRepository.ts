import { PrismaClient } from "@prisma/client";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { IRent } from "../interfaces/IRent";
import { IRentRepository } from "../interfaces/IRentRepository";
import { ReadOnlyError } from "../models/errors/generalErrors";

export class RentRepository implements IRentRepository {
  private prisma: PrismaClient;

  constructor(_prisma: PrismaClient) {
    this.prisma = _prisma;
  }

  async get(id: string): Promise<IRent | null> {
    return this.prisma.rent.findFirst({ where: { id } });
  }

  async getAll(): Promise<IRent[]> {
    return this.prisma.rent.findMany();
  }

  async update(newRent: IRent): Promise<void> {
    try {
      await this.prisma.rent.update({
        data: newRent,
        where: { id: newRent.id },
      });
    } catch (e) {
      throw new Error(`Failed to update rent with id = ${newRent.id}`);
    }
  }

  async create(data: IRent): Promise<void> {
    try {
      await this.prisma.rent.create({ data });
    } catch (e) {
      if (e instanceof PrismaClientUnknownRequestError) {
        throw new ReadOnlyError();
      }
      throw new Error("Failed to create new rent");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.rent.delete({ where: { id } });
    } catch (e) {
      throw new Error("Failed to delete rent");
    }
  }

  async getInDate(adId: string, from: Date, to: Date): Promise<IRent[]> {
    return await this.prisma.rent.findMany({
      where: {
        adId,
        dateFrom: { lt: to },
        dateUntil: { gt: from },
      },
    });
  }

  async getAdvertisementRents(adId: string): Promise<IRent[]> {
    return await this.prisma.rent.findMany({
      where: {
        adId,
      },
    });
  }

  async getWithFilters(filters: Partial<IRent>) {
    return await this.prisma.rent.findMany({
      where: {
        ...filters,
      },
    });
  }

  async getUsersRents(id: string): Promise<IRent[]> {
    return await this.prisma.rent.findMany({
      where: {
        userId: id,
      },
    });
  }
}
