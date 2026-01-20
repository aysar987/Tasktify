import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });
  }

  updateMe(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });  
  }

  async getWorkerProfile(workerId: string) {
    const worker = await this.prisma.user.findUnique({
      where: { id: workerId },
      select: {
        id: true,
        name: true,
        role: true,
        works: {
          where: { status: 'COMPLETED' },
          select: { id: true },
        },
        receivedReviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!worker || worker.role !== 'WORKER') {
      throw new ForbiddenException('Not a worker');
    }

    const reviewCount = worker.receivedReviews.length;

    const averageRating =
      reviewCount === 0
        ? 0
        : worker.receivedReviews.reduce((sum, r) => sum + r.rating, 0) /
          reviewCount;

    return {
      id: worker.id,
      name: worker.name,
      completedTasks: worker.works.length,
      reviewCount,
      averageRating: Number(averageRating.toFixed(2)),
    };
  }


}
