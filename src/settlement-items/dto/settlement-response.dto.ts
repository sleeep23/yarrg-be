import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ParticipantResponseDto } from 'src/delivery-groups/dto/participant-response.dto';

export class SettlementItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  settlementId: string;

  @ApiProperty()
  participantId: string;

  @ApiProperty({ example: 9000 })
  menuTotal: number;

  @ApiProperty({ example: 1500 })
  deliveryFeeShare: number;

  @ApiProperty({ example: 10500 })
  totalAmount: number;

  @ApiProperty({ example: false })
  isPaid: boolean;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  paidAt?: string | null;

  @ApiPropertyOptional({ type: () => ParticipantResponseDto })
  participant?: ParticipantResponseDto;
}

export class SettlementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deliveryGroupId: string;

  @ApiProperty({ example: 3000 })
  deliveryFee: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: () => SettlementItemResponseDto, isArray: true })
  items: SettlementItemResponseDto[];
}
