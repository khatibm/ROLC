import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('بيانات الدخول غير صحيحة');

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('بيانات الدخول غير صحيحة');

    return admin;
  }

  async login(admin: { id: string; email: string; name: string }) {
    const payload = { sub: admin.id, email: admin.email, name: admin.name };
    return {
      access_token: this.jwtService.sign(payload),
      admin: { id: admin.id, email: admin.email, name: admin.name },
    };
  }
}
