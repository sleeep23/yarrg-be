import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class MenuRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  menuName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  optionText?: string;

  @ApiProperty({ minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ minimum: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}

export class ReplaceMyMenuRequestsDto {
  @ApiProperty({ type: MenuRequestDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuRequestDto)
  menuRequests: MenuRequestDto[];
}
