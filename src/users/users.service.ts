import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { ChangePasswordDto } from './dto/change-password.dto';


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

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const passwordMatch = await argon.verify(
      user.password,
      dto.currentPassword,
    );

    if (!passwordMatch) {
      throw new ForbiddenException('Current password is incorrect');
    }

    const newHashedPassword = await argon.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: newHashedPassword,
      },
    });

    return {
      message: 'Password updated successfully',
    };
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
