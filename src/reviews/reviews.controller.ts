import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { CreateReviewDto } from './dto/create-review.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post(':taskId')
  @Roles('CLIENT')
  createReview(
    @Req() req: any,
    @Param('taskId') taskId: string,
    @Body() body: CreateReviewDto,
  ) {
    return this.reviews.createReview(req.user.id, taskId, body);
  }

  @Get('worker/:id')
  getWorkerReviews(@Param('id') workerId: string) {
    return this.reviews.getWorkerReviews(workerId);
  }
}
