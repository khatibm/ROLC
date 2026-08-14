import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('admin')
@ApiBearerAuth('admin-jwt')
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  @ApiOperation({ summary: '[Admin] Get current admin profile' })
  me(@Request() req: any) { return req.user; }

  @Get('dashboard')
  @ApiOperation({ summary: '[Admin] Get dashboard statistics' })
  async dashboard() {
    const [newsCount, eventsCount, personsCount, branchesCount, ticketsNew, ticketsTotal] =
      await Promise.all([
        this.prisma.news.count(),
        this.prisma.event.count(),
        this.prisma.person.count(),
        this.prisma.branch.count(),
        this.prisma.ticket.count({ where: { status: 'NEW' } }),
        this.prisma.ticket.count(),
      ]);

    return {
      news: newsCount,
      events: eventsCount,
      persons: personsCount,
      branches: branchesCount,
      tickets: { new: ticketsNew, total: ticketsTotal },
    };
  }
}
