import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { AdminTicketsController } from './admin-tickets.controller';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  controllers: [TicketsController, AdminTicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
