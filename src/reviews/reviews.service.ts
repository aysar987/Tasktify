import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) {}

    async createReview(
    clientId: string,
    taskId: string,
    data: { rating: number; comment?: string },
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { review: true },
    });

    if (!task) {
      throw new ForbiddenException('Task not found');
    }

    if (task.clientId !== clientId) {
      throw new ForbiddenException('Not your task');
    }

    if (task.status !== 'COMPLETED') {
      throw new ForbiddenException('Task not completed');
    }

    if (!task.workerId) {
      throw new ForbiddenException('No worker assigned');
    }

    if (task.review) {
      throw new ForbiddenException('Already reviewed');
    }

    return this.prisma.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        taskId: task.id,
        reviewerId: clientId,
        workerId: task.workerId,
      },
    });
  }

  getWorkerReviews(workerId: string) {
    return this.prisma.review.findMany({
      where: { workerId },
    });
  }$
}
