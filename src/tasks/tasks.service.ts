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
  // WORKER: VIEW OPEN TASKS
  getOpenTasks() {
    return this.prisma.task.findMany({
      where: {
        status: 'OPEN',
      },
    });
  }
  // WORKER: ACCEPT TASK
  async acceptTask(workerId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
     where: { id: taskId },
    });

    if (!task) {
     throw new ForbiddenException('Task not available');
    }

    if (task.status !== 'OPEN') {
    throw new ForbiddenException('Task already taken');
    }

    return this.prisma.task.update({
     where: { id: taskId },
     data: {
        status: 'ASSIGNED',
        worker: { connect: { id: workerId } },
      },
    });
  }

  // CLIENT: COMPLETE TASK
  async completeTask(clientId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.clientId !== clientId) {
     throw new ForbiddenException();
    }

    return this.prisma.task.update({
     where: { id: taskId },
     data: {
        status: 'COMPLETED',
      },
    });
  }


  // UPDATE TASK (ONLY OWNER)
  async updateTask(
    taskId: string,
    userId: string,
    data: any,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
    throw new ForbiddenException('Task not found');
    }

    if (task.clientId !== userId) {
      throw new ForbiddenException('You do not own this task');
    }

    if (task.status !== 'OPEN') {
    throw new ForbiddenException('Task already assigned');
    } 

    return this.prisma.task.update({
      where: { id: taskId },
      data,
    });
  }
  
}
