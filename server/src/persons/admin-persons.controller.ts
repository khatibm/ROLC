import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PersonsService } from './persons.service';
import { CreatePersonDto, UpdatePersonDto } from './persons.dto';

@ApiTags('admin')
@ApiBearerAuth('admin-jwt')
@UseGuards(JwtAuthGuard)
@Controller('admin/persons')
export class AdminPersonsController {
  constructor(private personsService: PersonsService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List all persons' })
  findAll(@Query() query: { q?: string; branchId?: string; page?: number; limit?: number }) {
    return this.personsService.findAll(query, false);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get person by ID' })
  findOne(@Param('id') id: string) { return this.personsService.findOne(id, false); }

  @Post()
  @ApiOperation({ summary: '[Admin] Create person' })
  create(@Body() dto: CreatePersonDto) { return this.personsService.create(dto); }

  @Put(':id')
  @ApiOperation({ summary: '[Admin] Update person' })
  update(@Param('id') id: string, @Body() dto: UpdatePersonDto) { return this.personsService.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete person' })
  remove(@Param('id') id: string) { return this.personsService.remove(id); }

  @Post('upload-photo')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '[Admin] Upload person photo' })
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { error: 'No file provided' };
    return { url: `/uploads/${file.filename}` };
  }
}
