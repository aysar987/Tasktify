import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    const hashed = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: { email, password: hashed, name },
    });

    return this.signToken(user.id, user.email, user.role);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException();

    const valid = await argon2.verify(user.password, password);
    if (!valid) throw new UnauthorizedException();

    return this.signToken(user.id, user.email, user.role);
  }

  private signToken(id: string, email: string, role: string) {
    return {
      access_token: this.jwt.sign({ sub: id, email, role }),
    };
  }
}
