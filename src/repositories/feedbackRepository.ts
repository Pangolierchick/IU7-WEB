import { PrismaClient } from "@prisma/client";
import { IFeedback, IFeedbackWithUser } from "../interfaces/IFeedback";
import { IFeedbackRepository } from "../interfaces/IFeedbackRepository";

export class FeedbackRepository implements IFeedbackRepository {
  private prisma: PrismaClient;

  constructor(_prisma: PrismaClient) {
    this.prisma = _prisma;
  }
  async getWithUser(id: string): Promise<IFeedbackWithUser | null> {
    const f = await this.prisma.feedback.findFirst({
      where: { id },
      include: { user: { select: { role: true, login: true } } },
    });

    if (f) {
      return {
        role: f.user.role,
        login: f.user.login,
        ...f,
      };
    }

    return f;
  }

  async getAdvertisementFeedbacks(adId: string): Promise<IFeedback[]> {
    return await this.prisma.feedback.findMany({ where: { adId } });
  }

  async getAll(): Promise<IFeedback[]> {
    return await this.prisma.feedback.findMany();
  }
  async create(data: IFeedback): Promise<void> {
    try {
      await this.prisma.feedback.create({ data });
    } catch (e) {
      throw new Error("Failed to create feedback");
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await this.prisma.feedback.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new Error("Failed to delete feedback");
    }
  }
  async update(n: IFeedback): Promise<void> {
    try {
      await this.prisma.feedback.update({ data: n, where: { id: n.id } });
    } catch (e) {
      throw new Error("Failed to update feedback");
    }
  }

  async get(id: string): Promise<IFeedback | null> {
    return this.prisma.feedback.findFirst({ where: { id } });
  }

  async getUsersFeedbacks(userId: string): Promise<IFeedback[]> {
    return await this.prisma.feedback.findMany({ where: { userId } });
  }
}
