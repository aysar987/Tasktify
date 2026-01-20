import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UsersService } from './users.service';
import { UpdateMeDto } from './dto/update-me.dto';


@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.getMe(req.user.id);
  }

  @Patch('me')
  updateMe(
    @Req() req: any,
    @Body() body: UpdateMeDto,
  ) {
    return this.usersService.updateMe(req.user.id, body);
  }
}
