import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { NewsQueryDto } from './news.dto';

@ApiTags('public')
@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'List published news with pagination + filtering' })
  findAll(@Query() query: NewsQueryDto) {
    return this.newsService.findAll(query, true);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get list of news categories with counts' })
  getCategories() {
    return this.newsService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single news item by ID' })
  @ApiParam({ name: 'id', description: 'News UUID' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id, true);
  }
}
