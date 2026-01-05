import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  // PUBLIC
  @Post('register')
  register(@Body() body: any) {
    return this.auth.register(body.email, body.password, body.name);
  }

  // PUBLIC
  @Post('login')
  login(@Body() body: any) {
    return this.auth.login(body.email, body.password);
  }

  // 🔒 PROTECTED (JWT REQUIRED)
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }
}
