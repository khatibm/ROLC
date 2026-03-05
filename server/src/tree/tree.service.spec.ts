import { Test, TestingModule } from '@nestjs/testing';
import { TreeService } from './tree.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  person: { findFirst: jest.fn(), findMany: jest.fn() },
  personTreePath: { findMany: jest.fn(), upsert: jest.fn() },
  relationship: { findMany: jest.fn() },
};

describe('TreeService', () => {
  let service: TreeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TreeService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<TreeService>(TreeService);
    jest.clearAllMocks();
  });

  describe('getNode', () => {
    it('returns node with parents, children, spouses', async () => {
      const person = { id: 'p1', fullNameAr: 'تميم', gender: 'M', isPublic: true };
      mockPrisma.person.findFirst.mockResolvedValue(person);
      mockPrisma.personTreePath.findMany
        .mockResolvedValueOnce([{ ancestor: { id: 'p0', fullNameAr: 'الجد' } }])
        .mockResolvedValueOnce([{ descendant: { id: 'p2', fullNameAr: 'الابن' } }]);
      mockPrisma.relationship.findMany.mockResolvedValue([]);

      const result = await service.getNode('p1');
      expect(result.node).toEqual(person);
      expect(result.parents).toHaveLength(1);
      expect(result.children).toHaveLength(1);
      expect(result.spouses).toHaveLength(0);
    });

    it('throws NotFoundException for unknown person', async () => {
      mockPrisma.person.findFirst.mockResolvedValue(null);
      await expect(service.getNode('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('searches persons by name', async () => {
      mockPrisma.person.findMany.mockResolvedValue([{ id: 'p1', fullNameAr: 'عبدالله' }]);
      const result = await service.search('عبدالله');
      expect(result).toHaveLength(1);
      expect(mockPrisma.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ fullNameAr: { contains: 'عبدالله', mode: 'insensitive' } }),
        }),
      );
    });

    it('filters by branchId', async () => {
      mockPrisma.person.findMany.mockResolvedValue([]);
      await service.search('', 'branch-uuid');
      expect(mockPrisma.person.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ branchId: 'branch-uuid' }) }),
      );
    });
  });

  describe('getAncestors', () => {
    it('returns ancestors ordered by depth', async () => {
      mockPrisma.personTreePath.findMany.mockResolvedValue([
        { depth: 1, ancestor: { id: 'p0', fullNameAr: 'الأب' } },
        { depth: 2, ancestor: { id: 'pg', fullNameAr: 'الجد' } },
      ]);
      const result = await service.getAncestors('p1');
      expect(result).toHaveLength(2);
      expect(result[0].depth).toBe(1);
    });
  });
});
