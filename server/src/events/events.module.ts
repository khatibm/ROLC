import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AdminEventsController } from './admin-events.controller';

@Module({
  controllers: [EventsController, AdminEventsController],
  providers: [EventsService],
})
export class EventsModule {}
