import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto, EventQueryDto, UpdateEventDto } from './events.dto';

@ApiTags('admin')
@ApiBearerAuth('admin-jwt')
@UseGuards(JwtAuthGuard)
@Controller('admin/events')
export class AdminEventsController {
  constructor(private eventsService: EventsService) {}

  @Get() @ApiOperation({ summary: '[Admin] List all events' })
  findAll(@Query() query: EventQueryDto) { return this.eventsService.findAll(query, false); }

  @Get(':id') @ApiOperation({ summary: '[Admin] Get event by ID' })
  findOne(@Param('id') id: string) { return this.eventsService.findOne(id, false); }

  @Post() @ApiOperation({ summary: '[Admin] Create event' })
  create(@Body() dto: CreateEventDto) { return this.eventsService.create(dto); }

  @Put(':id') @ApiOperation({ summary: '[Admin] Update event' })
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) { return this.eventsService.update(id, dto); }

  @Delete(':id') @ApiOperation({ summary: '[Admin] Delete event' })
  remove(@Param('id') id: string) { return this.eventsService.remove(id); }
}
