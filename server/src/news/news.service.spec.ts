import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  news: {
    findMany: jest.fn(),
    count: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    groupBy: jest.fn(),
  },
};

describe('NewsService', () => {
  let service: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<NewsService>(NewsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns paginated news for public', async () => {
      mockPrisma.news.findMany.mockResolvedValue([{ id: '1', titleAr: 'خبر' }]);
      mockPrisma.news.count.mockResolvedValue(1);
      const result = await service.findAll({ page: 1, limit: 10 }, true);
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(mockPrisma.news.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isPublished: true } }),
      );
    });

    it('filters by category', async () => {
      mockPrisma.news.findMany.mockResolvedValue([]);
      mockPrisma.news.count.mockResolvedValue(0);
      await service.findAll({ category: 'أخبار', page: 1, limit: 10 }, true);
      expect(mockPrisma.news.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isPublished: true, category: 'أخبار' } }),
      );
    });

    it('searches by text', async () => {
      mockPrisma.news.findMany.mockResolvedValue([]);
      mockPrisma.news.count.mockResolvedValue(0);
      await service.findAll({ q: 'تميم', page: 1, limit: 10 }, true);
      const call = mockPrisma.news.findMany.mock.calls[0][0];
      expect(call.where.OR).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('returns news when found', async () => {
      const news = { id: 'abc', titleAr: 'خبر', isPublished: true };
      mockPrisma.news.findFirst.mockResolvedValue(news);
      const result = await service.findOne('abc', true);
      expect(result).toEqual(news);
    });

    it('throws NotFoundException when not found', async () => {
      mockPrisma.news.findFirst.mockResolvedValue(null);
      await expect(service.findOne('missing', true)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates news with default publishedAt', async () => {
      const dto = { titleAr: 'خبر جديد', contentAr: 'محتوى', category: 'عام' };
      const created = { id: '1', ...dto };
      mockPrisma.news.create.mockResolvedValue(created);
      const result = await service.create(dto);
      expect(result).toEqual(created);
      expect(mockPrisma.news.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates news when exists', async () => {
      const existing = { id: '1', titleAr: 'قديم', isPublished: true };
      mockPrisma.news.findFirst.mockResolvedValue(existing);
      mockPrisma.news.update.mockResolvedValue({ ...existing, titleAr: 'محدّث' });
      const result = await service.update('1', { titleAr: 'محدّث', contentAr: 'x' } as any);
      expect(result.titleAr).toBe('محدّث');
    });
  });

  describe('remove', () => {
    it('deletes news when exists', async () => {
      mockPrisma.news.findFirst.mockResolvedValue({ id: '1' });
      mockPrisma.news.delete.mockResolvedValue({ id: '1' });
      await service.remove('1');
      expect(mockPrisma.news.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('getCategories', () => {
    it('returns categories with counts', async () => {
      mockPrisma.news.groupBy.mockResolvedValue([
        { category: 'أخبار', _count: 3 },
        { category: 'مبادرات', _count: 1 },
      ]);
      const result = await service.getCategories();
      expect(result).toHaveLength(2);
      expect(result[0].category).toBe('أخبار');
    });
  });
});
