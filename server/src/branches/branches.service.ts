import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional } from 'class-validator';

export class CreateBranchDto {
  @IsString() nameAr: string;
  @IsOptional() @IsString() parentBranchId?: string;
}

export class UpdateBranchDto extends CreateBranchDto {}

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const branches = await this.prisma.branch.findMany({
      include: { children: { select: { id: true, nameAr: true } }, _count: { select: { persons: true } } },
      orderBy: { nameAr: 'asc' },
    });
    return branches;
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        children: true,
        parent: { select: { id: true, nameAr: true } },
        _count: { select: { persons: true } },
      },
    });
    if (!branch) throw new NotFoundException('الفرع غير موجود');
    return branch;
  }

  async create(dto: CreateBranchDto) {
    return this.prisma.branch.create({ data: dto });
  }

  async update(id: string, dto: UpdateBranchDto) {
    await this.findOne(id);
    return this.prisma.branch.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.branch.delete({ where: { id } });
  }

  // Build nested tree structure
  async getTree() {
    const all = await this.prisma.branch.findMany({ orderBy: { nameAr: 'asc' } });
    const map = new Map(all.map((b) => [b.id, { ...b, children: [] as any[] }]));
    const roots: any[] = [];
    for (const b of map.values()) {
      if (b.parentBranchId && map.has(b.parentBranchId)) {
        map.get(b.parentBranchId)!.children.push(b);
      } else {
        roots.push(b);
      }
    }
    return roots;
  }
}
