import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { NewsService } from './news.service';
import { CreateNewsDto, NewsQueryDto, UpdateNewsDto } from './news.dto';

@ApiTags('admin')
@ApiBearerAuth('admin-jwt')
@UseGuards(JwtAuthGuard)
@Controller('admin/news')
export class AdminNewsController {
  constructor(private newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List all news including drafts' })
  findAll(@Query() query: NewsQueryDto) {
    return this.newsService.findAll(query, false);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get news by ID' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id, false);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create news article' })
  create(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '[Admin] Update news article' })
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete news article' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }

  @Post('upload-cover')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '[Admin] Upload cover image' })
  @UseInterceptors(FileInterceptor('file'))
  uploadCover(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { error: 'No file provided' };
    return { url: `/uploads/${file.filename}` };
  }
}
