import { ApiProperty } from '@nestjs/swagger';
import { DeliveryGroupResponseDto } from './delivery-group-response.dto';
import { SettlementResponseDto } from './settlement-response.dto';

export default class PlaceOrderResponseDto {
  @ApiProperty({ type: DeliveryGroupResponseDto })
  deliveryGroup: DeliveryGroupResponseDto;

  @ApiProperty({ type: SettlementResponseDto })
  settlement: SettlementResponseDto;
}
