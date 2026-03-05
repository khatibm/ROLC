import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TreeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns a node with its direct parents and children.
   * Uses closure table for O(1) depth lookup.
   */
  async getNode(personId: string) {
    const person = await this.prisma.person.findFirst({
      where: { id: personId, isPublic: true },
      include: { branch: { select: { id: true, nameAr: true } } },
    });
    if (!person) throw new NotFoundException('الشخص غير موجود');

    // Direct parents (depth 1 ancestors)
    const parentPaths = await this.prisma.personTreePath.findMany({
      where: { descendantId: personId, depth: 1 },
      include: { ancestor: { select: { id: true, fullNameAr: true, gender: true, photoUrl: true, branchId: true } } },
    });

    // Direct children (depth 1 descendants)
    const childPaths = await this.prisma.personTreePath.findMany({
      where: { ancestorId: personId, depth: 1 },
      include: { descendant: { select: { id: true, fullNameAr: true, gender: true, photoUrl: true, branchId: true } } },
    });

    // Spouses via relationships
    const spouseRels = await this.prisma.relationship.findMany({
      where: {
        OR: [{ personId, relationType: 'SPOUSE' }, { relatedPersonId: personId, relationType: 'SPOUSE' }],
        status: 'CONFIRMED',
      },
      include: {
        person: { select: { id: true, fullNameAr: true, gender: true, photoUrl: true } },
        relatedPerson: { select: { id: true, fullNameAr: true, gender: true, photoUrl: true } },
      },
    });

    const spouses = spouseRels.map((r) =>
      r.personId === personId ? r.relatedPerson : r.person,
    );

    return {
      node: person,
      parents: parentPaths.map((p) => p.ancestor),
      children: childPaths.map((c) => c.descendant),
      spouses,
    };
  }

  /**
   * Search persons by name or branch for tree navigation.
   */
  async search(q: string, branchId?: string) {
    const where: any = { isPublic: true };
    if (q) where.fullNameAr = { contains: q, mode: 'insensitive' };
    if (branchId) where.branchId = branchId;

    return this.prisma.person.findMany({
      where,
      take: 30,
      select: {
        id: true, fullNameAr: true, gender: true, photoUrl: true,
        branch: { select: { id: true, nameAr: true } },
      },
      orderBy: { fullNameAr: 'asc' },
    });
  }

  /**
   * Get all ancestors up to root (using closure table).
   */
  async getAncestors(personId: string, maxDepth = 10) {
    const paths = await this.prisma.personTreePath.findMany({
      where: { descendantId: personId, depth: { gt: 0, lte: maxDepth } },
      include: { ancestor: { select: { id: true, fullNameAr: true, gender: true, photoUrl: true } } },
      orderBy: { depth: 'asc' },
    });
    return paths.map((p) => ({ ...p.ancestor, depth: p.depth }));
  }

  /**
   * Get all descendants (using closure table).
   */
  async getDescendants(personId: string, maxDepth = 5) {
    const paths = await this.prisma.personTreePath.findMany({
      where: { ancestorId: personId, depth: { gt: 0, lte: maxDepth } },
      include: { descendant: { select: { id: true, fullNameAr: true, gender: true, photoUrl: true } } },
      orderBy: { depth: 'asc' },
    });
    return paths.map((p) => ({ ...p.descendant, depth: p.depth }));
  }

  /**
   * Get the full subtree rooted at personId for interactive tree display.
   * Returns hierarchical JSON structure.
   */
  async getSubtree(personId: string, maxDepth = 4) {
    const root = await this.prisma.person.findFirst({
      where: { id: personId, isPublic: true },
      select: { id: true, fullNameAr: true, gender: true, photoUrl: true, branchId: true },
    });
    if (!root) throw new NotFoundException('الشخص غير موجود');

    return this.buildSubtree(root as any, maxDepth, 0, new Set());
  }

  private async buildSubtree(person: any, maxDepth: number, currentDepth: number, visited: Set<string>): Promise<any> {
    if (visited.has(person.id) || currentDepth >= maxDepth) {
      return { ...person, children: [] };
    }
    visited.add(person.id);

    const childPaths = await this.prisma.personTreePath.findMany({
      where: { ancestorId: person.id, depth: 1 },
      include: { descendant: { select: { id: true, fullNameAr: true, gender: true, photoUrl: true, branchId: true } } },
    });

    const children = await Promise.all(
      childPaths.map((c) => this.buildSubtree(c.descendant as any, maxDepth, currentDepth + 1, visited)),
    );

    return { ...person, children };
  }
}
