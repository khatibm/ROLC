import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrisma = {
  ticket: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('TicketsService', () => {
  let service: TicketsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<TicketsService>(TicketsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates ticket and returns ticket number', async () => {
      const dto = { type: 'SUGGESTION' as const, title: 'اقتراح', message: 'رسالة' };
      const created = { ...dto, id: 'abcdef12-3456-7890-abcd-ef1234567890', createdAt: new Date('2025-01-15') };
      mockPrisma.ticket.create.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result.ticket).toEqual(created);
      expect(result.ticketNumber).toContain('TKT-2025-ABCDEF12');
    });
  });

  describe('findAll', () => {
    it('returns paginated tickets', async () => {
      mockPrisma.ticket.findMany.mockResolvedValue([{ id: '1', type: 'COMPLAINT' }]);
      mockPrisma.ticket.count.mockResolvedValue(5);
      const result = await service.findAll(undefined, 1, 20);
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(5);
    });

    it('filters by status', async () => {
      mockPrisma.ticket.findMany.mockResolvedValue([]);
      mockPrisma.ticket.count.mockResolvedValue(0);
      await service.findAll('NEW', 1, 20);
      expect(mockPrisma.ticket.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'NEW' } }),
      );
    });
  });

  describe('findOne', () => {
    it('returns ticket when found', async () => {
      const ticket = { id: '1', type: 'SUGGESTION' };
      mockPrisma.ticket.findUnique.mockResolvedValue(ticket);
      const result = await service.findOne('1');
      expect(result).toEqual(ticket);
    });

    it('throws NotFoundException when not found', async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('updates ticket status', async () => {
      const ticket = { id: '1', status: 'NEW' };
      mockPrisma.ticket.findUnique.mockResolvedValue(ticket);
      mockPrisma.ticket.update.mockResolvedValue({ ...ticket, status: 'IN_REVIEW' });

      const result = await service.updateStatus('1', 'IN_REVIEW');
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'IN_REVIEW' },
      });
    });

    it('updates with admin note', async () => {
      mockPrisma.ticket.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.ticket.update.mockResolvedValue({ id: '1', status: 'CLOSED', adminNote: 'تم المعالجة' });
      await service.updateStatus('1', 'CLOSED', 'تم المعالجة');
      expect(mockPrisma.ticket.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'CLOSED', adminNote: 'تم المعالجة' },
      });
    });
  });
});
