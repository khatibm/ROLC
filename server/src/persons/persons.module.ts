import { Module } from '@nestjs/common';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { AdminPersonsController } from './admin-persons.controller';
import { AdminRelationshipsController } from './admin-relationships.controller';

@Module({
  controllers: [PersonsController, AdminPersonsController, AdminRelationshipsController],
  providers: [PersonsService],
  exports: [PersonsService],
})
export class PersonsModule {}
