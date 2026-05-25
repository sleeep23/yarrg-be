import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { DeliveryGroupStatus } from 'generated/prisma/enums';

export class ListDeliveryGroupsQueryDto {
  @ApiPropertyOptional({ enum: DeliveryGroupStatus })
  @IsOptional()
  @IsEnum(DeliveryGroupStatus)
  status?: DeliveryGroupStatus;
  @ApiPropertyOptional({ enum: ['true', 'false'], example: 'true' })
  @IsOptional()
  @IsIn(['true', 'false'])
  mine?: 'true' | 'false';
}
