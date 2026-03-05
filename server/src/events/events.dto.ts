import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty() @IsString() titleAr: string;
  @ApiProperty() @IsString() descriptionAr: string;
  @ApiProperty() @IsDateString() startAt: string;
  @ApiProperty() @IsDateString() endAt: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() locationText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mapUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isPublished?: boolean;
}

export class UpdateEventDto extends CreateEventDto {}

export class EventQueryDto {
  @ApiPropertyOptional() @IsOptional() from?: string;
  @ApiPropertyOptional() @IsOptional() to?: string;
  @ApiPropertyOptional() @IsOptional() city?: string;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}
