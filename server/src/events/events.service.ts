import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, EventQueryDto, UpdateEventDto } from './events.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: EventQueryDto, publicOnly = true) {
    const { from, to, city, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (publicOnly) where.isPublished = true;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (from || to) {
      where.startAt = {};
      if (from) where.startAt.gte = new Date(from);
      if (to) where.startAt.lte = new Date(to);
    }

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        orderBy: { startAt: 'asc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data,
      meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    };
  }

  async findOne(id: string, publicOnly = true) {
    const event = await this.prisma.event.findFirst({
      where: { id, ...(publicOnly ? { isPublished: true } : {}) },
    });
    if (!event) throw new NotFoundException('الفعالية غير موجودة');
    return event;
  }

  async create(dto: CreateEventDto) {
    return this.prisma.event.create({
      data: { ...dto, startAt: new Date(dto.startAt), endAt: new Date(dto.endAt) },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    await this.findOne(id, false);
    return this.prisma.event.update({
      where: { id },
      data: { ...dto, startAt: new Date(dto.startAt), endAt: new Date(dto.endAt) },
    });
  }

  async remove(id: string) {
    await this.findOne(id, false);
    return this.prisma.event.delete({ where: { id } });
  }
}
