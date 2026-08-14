import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BranchesService } from './branches.service';

@ApiTags('public')
@Controller('branches')
export class BranchesController {
  constructor(private branchesService: BranchesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tribe branches as nested tree' })
  getTree() { return this.branchesService.getTree(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get branch details by ID' })
  findOne(@Param('id') id: string) { return this.branchesService.findOne(id); }
}
