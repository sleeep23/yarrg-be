import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateDeliveryGroupDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pickupPlace: string;

  @ApiProperty({ example: '2026-05-25T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  recruitmentDeadline: Date;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  maxParticipants: number;
}
