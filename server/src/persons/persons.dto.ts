import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty() @IsString() fullNameAr: string;
  @ApiProperty({ enum: ['M', 'F'] }) @IsEnum(['M', 'F']) gender: 'M' | 'F';
  @ApiPropertyOptional() @IsOptional() @IsDateString() birthDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() deathDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() branchId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bio?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() photoUrl?: string;
  @ApiPropertyOptional({ default: true }) @IsOptional() @IsBoolean() isPublic?: boolean;
}

export class UpdatePersonDto extends CreatePersonDto {}

export class CreateRelationshipDto {
  @ApiProperty() @IsUUID() personId: string;
  @ApiProperty() @IsUUID() relatedPersonId: string;
  @ApiProperty({ enum: ['FATHER', 'MOTHER', 'SPOUSE'] })
  @IsEnum(['FATHER', 'MOTHER', 'SPOUSE'])
  relationType: 'FATHER' | 'MOTHER' | 'SPOUSE';
}

export class UpdateRelationshipStatusDto {
  @ApiProperty({ enum: ['CONFIRMED', 'PENDING', 'REJECTED'] })
  @IsEnum(['CONFIRMED', 'PENDING', 'REJECTED'])
  status: 'CONFIRMED' | 'PENDING' | 'REJECTED';
}
