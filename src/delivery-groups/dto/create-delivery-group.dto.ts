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
  @ApiPropertyOptional({ example: '같이 야식 시키실 분들 찾아요..' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '기영이 숯불두마리치킨 광주첨단점' })
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @ApiProperty({ example: '신관 1층 로비' })
  @IsString()
  @IsNotEmpty()
  pickupPlace: string;

  @ApiProperty({ example: '2026-05-25T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  recruitmentDeadline: Date;

  @ApiProperty({ minimum: 1, example: 4 })
  @IsNumber()
  @Min(1)
  maxParticipants: number;
}
