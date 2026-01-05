import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  getMe(@Req() req: any) {
    return this.users.getMe(req.user.sub);
  }

  @Patch('me')
  updateMe(@Req() req: any, @Body() body: any) {
    return this.users.updateMe(req.user.sub, body);
  }
}
