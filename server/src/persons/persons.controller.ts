import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PersonsService } from './persons.service';

@ApiTags('public')
@Controller('persons')
export class PersonsController {
  constructor(private personsService: PersonsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get person profile with relationships' })
  findOne(@Param('id') id: string) {
    return this.personsService.findOne(id, true);
  }
}
