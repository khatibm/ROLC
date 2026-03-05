import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({ enum: ['SUGGESTION', 'COMPLAINT'] })
  @IsEnum(['SUGGESTION', 'COMPLAINT'])
  type: 'SUGGESTION' | 'COMPLAINT';

  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() message: string;

  @ApiPropertyOptional() @IsOptional() @IsString() attachmentUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() contactEmail?: string;
}

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTicketDto) {
    const ticket = await this.prisma.ticket.create({ data: dto });
    return {
      ticketNumber: `TKT-${ticket.createdAt.getFullYear()}-${ticket.id.slice(0, 8).toUpperCase()}`,
      ticket,
    };
  }

  async findAll(status?: string, page = 1, limit = 20) {
    const where: any = {};
    if (status) where.status = status;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where, skip, take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });
    if (!ticket) throw new NotFoundException('التذكرة غير موجودة');
    return ticket;
  }

  async updateStatus(id: string, status: 'NEW' | 'IN_REVIEW' | 'CLOSED', adminNote?: string) {
    await this.findOne(id);
    return this.prisma.ticket.update({ where: { id }, data: { status, ...(adminNote ? { adminNote } : {}) } });
  }
}
