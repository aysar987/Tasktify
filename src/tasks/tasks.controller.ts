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

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Post()
  createTask(@Req() req: any,
  @Body() body: CreateTaskDto,
) {
  return this.tasks.createTask(req.user.id, body);
}


  @Get()
  getMyTasks(@Req() req: any) {
    return this.tasks.getMyTasks(req.user.id);
  }

  @Patch(':id')
  updateTask(
    @Req() req: any,
    @Param('id') taskId: string,
    @Body() body: UpdateTaskDto,
  ) {
    return this.tasks.updateTask(
      req.user.id,
      taskId,
      body,
    );
  }
}
    