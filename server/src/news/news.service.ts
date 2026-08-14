import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto, NewsQueryDto, UpdateNewsDto } from './news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: NewsQueryDto, publicOnly = true) {
    const { category, q, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (publicOnly) where.isPublished = true;
    if (category) where.category = category;
    if (q) {
      where.OR = [
        { titleAr: { contains: q, mode: 'insensitive' } },
        { contentAr: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: Number(limit),
        select: {
          id: true, titleAr: true, category: true,
          coverImageUrl: true, publishedAt: true, isPublished: true, createdAt: true,
        },
      }),
      this.prisma.news.count({ where }),
    ]);

    return {
      data,
      meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string, publicOnly = true) {
    const news = await this.prisma.news.findFirst({
      where: { id, ...(publicOnly ? { isPublished: true } : {}) },
    });
    if (!news) throw new NotFoundException('الخبر غير موجود');
    return news;
  }

  async create(dto: CreateNewsDto) {
    return this.prisma.news.create({
      data: {
        ...dto,
        galleryJson: dto.galleryJson || [],
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
      },
    });
  }

  async update(id: string, dto: UpdateNewsDto) {
    await this.findOne(id, false);
    return this.prisma.news.update({
      where: { id },
      data: {
        ...dto,
        galleryJson: dto.galleryJson || [],
        ...(dto.publishedAt ? { publishedAt: new Date(dto.publishedAt) } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id, false);
    return this.prisma.news.delete({ where: { id } });
  }

  async getCategories() {
    const cats = await this.prisma.news.groupBy({
      by: ['category'],
      _count: true,
      where: { isPublished: true },
    });
    return cats.map((c) => ({ category: c.category, count: c._count }));
  }
}
