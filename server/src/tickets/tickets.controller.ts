import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { TicketsService, CreateTicketDto } from './tickets.service';

@ApiTags('public')
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiOperation({ summary: 'Submit a suggestion or complaint ticket (supports file attachment)' })
  @UseInterceptors(FileInterceptor('attachment'))
  async create(
    @Body() dto: CreateTicketDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.attachmentUrl = `/uploads/${file.filename}`;
    }
    return this.ticketsService.create(dto);
  }
}
