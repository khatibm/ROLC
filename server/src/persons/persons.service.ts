import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonDto, UpdatePersonDto, CreateRelationshipDto } from './persons.dto';

@Injectable()
export class PersonsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, publicOnly = true) {
    const person = await this.prisma.person.findFirst({
      where: { id, ...(publicOnly ? { isPublic: true } : {}) },
      include: {
        branch: { select: { id: true, nameAr: true } },
        relationships: {
          where: { status: 'CONFIRMED' },
          include: { relatedPerson: { select: { id: true, fullNameAr: true, gender: true, photoUrl: true } } },
        },
        relatedRelationships: {
          where: { status: 'CONFIRMED' },
          include: { person: { select: { id: true, fullNameAr: true, gender: true, photoUrl: true } } },
        },
      },
    });
    if (!person) throw new NotFoundException('الشخص غير موجود');
    return person;
  }

  async findAll(query: { q?: string; branchId?: string; page?: number; limit?: number }, publicOnly = true) {
    const { q, branchId, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (publicOnly) where.isPublic = true;
    if (branchId) where.branchId = branchId;
    if (q) where.fullNameAr = { contains: q, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.person.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { fullNameAr: 'asc' },
        include: { branch: { select: { id: true, nameAr: true } } },
      }),
      this.prisma.person.count({ where }),
    ]);

    return { data, meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } };
  }

  async create(dto: CreatePersonDto) {
    const person = await this.prisma.person.create({
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        deathDate: dto.deathDate ? new Date(dto.deathDate) : null,
      },
    });
    // Initialize closure table with self-reference
    await this.prisma.personTreePath.create({
      data: { ancestorId: person.id, descendantId: person.id, depth: 0 },
    });
    return person;
  }

  async update(id: string, dto: UpdatePersonDto) {
    await this.findOne(id, false);
    return this.prisma.person.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        deathDate: dto.deathDate ? new Date(dto.deathDate) : null,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id, false);
    return this.prisma.person.delete({ where: { id } });
  }

  // ── Relationship management ─────────────────────────────────────
  async createRelationship(dto: CreateRelationshipDto) {
    const { personId, relatedPersonId, relationType } = dto;

    if (personId === relatedPersonId) {
      throw new BadRequestException('لا يمكن ربط الشخص بنفسه');
    }

    // Prevent cycles: check if relatedPerson is already a descendant of person
    if (relationType === 'FATHER' || relationType === 'MOTHER') {
      const cycleCheck = await this.prisma.personTreePath.findFirst({
        where: { ancestorId: relatedPersonId, descendantId: personId },
      });
      if (cycleCheck) {
        throw new BadRequestException('سيؤدي هذا الربط إلى حلقة مرجعية في الشجرة');
      }
    }

    const rel = await this.prisma.relationship.create({ data: dto });

    // Update closure table for parent-child relations
    if (relationType === 'FATHER' || relationType === 'MOTHER') {
      await this.updateClosureTableAfterRelationship(relatedPersonId, personId);
    }

    return rel;
  }

  private async updateClosureTableAfterRelationship(parentId: string, childId: string) {
    // Get all ancestors of parent (including parent itself)
    const parentAncestors = await this.prisma.personTreePath.findMany({
      where: { descendantId: parentId },
    });

    // Get all descendants of child (including child itself)
    const childDescendants = await this.prisma.personTreePath.findMany({
      where: { ancestorId: childId },
    });

    // Create cross product: each ancestor of parent → each descendant of child
    for (const anc of parentAncestors) {
      for (const desc of childDescendants) {
        const newDepth = anc.depth + desc.depth + 1;
        await this.prisma.personTreePath.upsert({
          where: { ancestorId_descendantId: { ancestorId: anc.ancestorId, descendantId: desc.descendantId } },
          update: { depth: newDepth },
          create: { ancestorId: anc.ancestorId, descendantId: desc.descendantId, depth: newDepth },
        });
      }
    }
  }

  async getRelationships(personId?: string) {
    const where = personId ? {
      OR: [{ personId }, { relatedPersonId: personId }],
    } : {};
    return this.prisma.relationship.findMany({
      where,
      include: {
        person: { select: { id: true, fullNameAr: true } },
        relatedPerson: { select: { id: true, fullNameAr: true } },
      },
    });
  }

  async updateRelationshipStatus(id: string, status: 'CONFIRMED' | 'PENDING' | 'REJECTED') {
    return this.prisma.relationship.update({ where: { id }, data: { status } });
  }

  async removeRelationship(id: string) {
    return this.prisma.relationship.delete({ where: { id } });
  }
}
