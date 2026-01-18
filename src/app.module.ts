import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule,TasksModule, ReviewsModule,],
})
export class AppModule {}
