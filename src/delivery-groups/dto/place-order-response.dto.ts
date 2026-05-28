import { ApiProperty } from '@nestjs/swagger';
import { DeliveryGroupResponseDto } from './delivery-group-response.dto';
import { SettlementResponseDto } from 'src/settlement-items/dto/settlement-response.dto';

export class PlaceOrderResponseDto {
  @ApiProperty({ type: () => DeliveryGroupResponseDto })
  deliveryGroup: DeliveryGroupResponseDto;

  @ApiProperty({ type: () => SettlementResponseDto })
  settlement: SettlementResponseDto;
}
