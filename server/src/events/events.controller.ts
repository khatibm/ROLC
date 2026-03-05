import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { EventQueryDto } from './events.dto';

@ApiTags('public')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'List upcoming events — filterable by date range and city' })
  findAll(@Query() query: EventQueryDto) {
    return this.eventsService.findAll(query, true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event details by ID' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id, true);
  }
}
