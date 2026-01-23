import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: string, dto: CreateReviewDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: dto.taskId },
      include: {
        review: true,
      },
    });

    if (!task) {
      throw new ForbiddenException('Task not found');
    }

    if (task.clientId !== userId) {
      throw new ForbiddenException('Not your task');
    }

    if (task.status !== TaskStatus.COMPLETED) {
      throw new ForbiddenException('Task not completed');
    }

    if (!task.workerId) {
      throw new ForbiddenException('No worker assigned');
    }

    if (task.workerId === userId) {
      throw new ForbiddenException('You cannot review yourself');
    }

    if (task.review) {
      throw new ForbiddenException('Already reviewed');
    }
    

    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        taskId: task.id,
        reviewerId: userId,
        workerId: task.workerId,
      },

      
    });
  }

  getWorkerReviews(workerId: string) {
    return this.prisma.review.findMany({
      where: { workerId },
    });
  }

  async getWorkerAverageRating(workerId: string) {
    const result = await this.prisma.review.aggregate({
      where: { workerId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      workerId,
      averageRating: result._avg.rating ?? 0,
      totalReviews: result._count.rating,
    };
  }

}
