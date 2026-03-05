import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BranchesService, CreateBranchDto, UpdateBranchDto } from './branches.service';

@ApiTags('admin')
@ApiBearerAuth('admin-jwt')
@UseGuards(JwtAuthGuard)
@Controller('admin/branches')
export class AdminBranchesController {
  constructor(private branchesService: BranchesService) {}

  @Get()     @ApiOperation({ summary: '[Admin] List branches' })
  findAll()  { return this.branchesService.findAll(); }

  @Get(':id') @ApiOperation({ summary: '[Admin] Get branch by ID' })
  findOne(@Param('id') id: string) { return this.branchesService.findOne(id); }

  @Post()    @ApiOperation({ summary: '[Admin] Create branch' })
  create(@Body() dto: CreateBranchDto) { return this.branchesService.create(dto); }

  @Put(':id') @ApiOperation({ summary: '[Admin] Update branch' })
  update(@Param('id') id: string, @Body() dto: UpdateBranchDto) { return this.branchesService.update(id, dto); }

  @Delete(':id') @ApiOperation({ summary: '[Admin] Delete branch' })
  remove(@Param('id') id: string) { return this.branchesService.remove(id); }
}
