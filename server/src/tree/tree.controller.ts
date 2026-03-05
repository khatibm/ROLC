import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TreeService } from './tree.service';

@ApiTags('public')
@Controller('tree')
export class TreeController {
  constructor(private treeService: TreeService) {}

  @Get('node/:personId')
  @ApiOperation({ summary: 'Get a tree node with its parents, children, and spouses' })
  @ApiParam({ name: 'personId', description: 'Person UUID' })
  getNode(@Param('personId') personId: string) {
    return this.treeService.getNode(personId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search persons in the family tree' })
  @ApiQuery({ name: 'q', required: false, description: 'Name search' })
  @ApiQuery({ name: 'branchId', required: false, description: 'Filter by branch' })
  search(@Query('q') q: string, @Query('branchId') branchId?: string) {
    return this.treeService.search(q || '', branchId);
  }

  @Get('subtree/:personId')
  @ApiOperation({ summary: 'Get full subtree rooted at person (for interactive display)' })
  @ApiParam({ name: 'personId' })
  @ApiQuery({ name: 'maxDepth', required: false, description: 'Max depth (default 4)' })
  getSubtree(@Param('personId') personId: string, @Query('maxDepth') maxDepth?: number) {
    return this.treeService.getSubtree(personId, maxDepth ? Number(maxDepth) : 4);
  }

  @Get('ancestors/:personId')
  @ApiOperation({ summary: 'Get all ancestors of a person (ordered by depth)' })
  getAncestors(@Param('personId') personId: string, @Query('maxDepth') maxDepth?: number) {
    return this.treeService.getAncestors(personId, maxDepth ? Number(maxDepth) : 10);
  }

  @Get('descendants/:personId')
  @ApiOperation({ summary: 'Get all descendants of a person' })
  getDescendants(@Param('personId') personId: string, @Query('maxDepth') maxDepth?: number) {
    return this.treeService.getDescendants(personId, maxDepth ? Number(maxDepth) : 5);
  }
}
