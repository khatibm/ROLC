import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { AdminNewsController } from './admin-news.controller';

@Module({
  controllers: [NewsController, AdminNewsController],
  providers: [NewsService],
})
export class NewsModule {}
