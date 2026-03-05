import { IsString, IsOptional, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({ example: 'عنوان الخبر', description: 'Arabic title' })
  @IsString()
  titleAr: string;

  @ApiProperty({ example: 'محتوى الخبر...', description: 'Arabic content' })
  @IsString()
  contentAr: string;

  @ApiPropertyOptional({ example: 'أخبار' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  galleryJson?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateNewsDto extends CreateNewsDto {}

export class NewsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Search query' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  limit?: number;
}
