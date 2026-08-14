import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TicketsService } from './tickets.service';

class UpdateTicketStatusDto {
  @IsEnum(['NEW', 'IN_REVIEW', 'CLOSED'])
  status: 'NEW' | 'IN_REVIEW' | 'CLOSED';

  @IsOptional() @IsString()
  adminNote?: string;
}

@ApiTags('admin')
@ApiBearerAuth('admin-jwt')
@UseGuards(JwtAuthGuard)
@Controller('admin/tickets')
export class AdminTicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List tickets, optionally filtered by status' })
  findAll(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ticketsService.findAll(status, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get ticket by ID' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '[Admin] Update ticket status + optional admin note' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateTicketStatusDto) {
    return this.ticketsService.updateStatus(id, dto.status, dto.adminNote);
  }
}
