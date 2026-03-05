import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PersonsService } from './persons.service';
import { CreateRelationshipDto, UpdateRelationshipStatusDto } from './persons.dto';

@ApiTags('admin')
@ApiBearerAuth('admin-jwt')
@UseGuards(JwtAuthGuard)
@Controller('admin/relationships')
export class AdminRelationshipsController {
  constructor(private personsService: PersonsService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List relationships, optionally by personId' })
  findAll(@Query('personId') personId?: string) {
    return this.personsService.getRelationships(personId);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create relationship + update closure table' })
  create(@Body() dto: CreateRelationshipDto) {
    return this.personsService.createRelationship(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '[Admin] Update relationship status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateRelationshipStatusDto) {
    return this.personsService.updateRelationshipStatus(id, dto.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete relationship' })
  remove(@Param('id') id: string) { return this.personsService.removeRelationship(id); }
}
