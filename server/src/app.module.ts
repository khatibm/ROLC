import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { EventsModule } from './events/events.module';
import { BranchesModule } from './branches/branches.module';
import { PersonsModule } from './persons/persons.module';
import { TreeModule } from './tree/tree.module';
import { TicketsModule } from './tickets/tickets.module';
import { AdminModule } from './admin/admin.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    NewsModule,
    EventsModule,
    BranchesModule,
    PersonsModule,
    TreeModule,
    TicketsModule,
    AdminModule,
    UploadsModule,
  ],
})
export class AppModule {}
