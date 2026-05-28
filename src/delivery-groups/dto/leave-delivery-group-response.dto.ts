import { ApiProperty } from '@nestjs/swagger';

export class LeaveDeliveryGroupResponseDto {
  @ApiProperty({ example: true })
  success: boolean;
}
