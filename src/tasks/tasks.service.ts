import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  // CREATE TASK (CLIENT)
  createTask(userId: string, data: any) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        client: {
        connect: { id: userId },
        },
      },
    });
  }

  // GET MY TASKS (CLIENT)
  getMyTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { clientId: userId },
    });
  }

  // UPDATE TASK (ONLY OWNER)
  async updateTask(
    taskId: string,
    userId: string,
    data: UpdateTaskDto,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.clientId !== userId) {
      throw new ForbiddenException('You do not own this task');
    }

    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }
}
