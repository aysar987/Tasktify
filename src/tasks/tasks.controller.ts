import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';


@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Post()
  @Roles('CLIENT')
  createTask(@Req() req: any,
  @Body() body: CreateTaskDto,
) {
  return this.tasks.createTask(req.user.id, body);
}


  @Get('open')
  @Roles('WORKER')
  getOpenTasks() {
    return this.tasks.getOpenTasks();
  }

  @Patch(':id/accept')
  @Roles('WORKER')
  acceptTask(
    @Req() req: any,
    @Param('id') taskId: string,
  ) {
    return this.tasks.acceptTask(
      req.user.id,
      taskId,
    );
  }
  @Patch(':id/complete')
  @Roles('CLIENT')
  completeTask(
    @Req() req: any,
    @Param('id') taskId: string,
  ) {
    return this.tasks.completeTask(req.user.id, taskId);
  }
}
    