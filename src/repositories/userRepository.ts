import { Prisma, PrismaClient } from "@prisma/client";
import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { AtLeast } from "../misc";
import { ReadOnlyError } from "../models/errors/generalErrors";
import { UserAlreadyExistError } from "../models/errors/userErrors";

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(_prisma: PrismaClient) {
    this.prisma = _prisma;
  }
  async get(id: string): Promise<IUser | null> {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async getAll(): Promise<IUser[]> {
    return this.prisma.user.findMany();
  }

  async create(data: IUser): Promise<void> {
    try {
      await this.prisma.user.create({ data });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientUnknownRequestError) {
        throw new ReadOnlyError();
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          // NOTE: "Unique constraint failed on the {constraint}"
          throw new UserAlreadyExistError();
        }
      }

      throw new Error("Failed to create new user");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (e) {
      throw new Error("Failed to delete user");
    }
  }

  async update(newUsr: AtLeast<IUser, "id">): Promise<void> {
    try {
      await this.prisma.user.update({ data: newUsr, where: { id: newUsr.id } });
    } catch (e) {
      throw new Error("Failed to update user");
    }
  }

  async getByLogin(login: string): Promise<IUser | null> {
    return this.prisma.user.findFirst({ where: { login } });
  }

  async getWithFilter(filters: Partial<IUser>): Promise<IUser[]> {
    return this.prisma.user.findMany({
      where: {
        ...filters,
      },
    });
  }
}
