import { ApiProperty } from '@nestjs/swagger';
import { ParticipantResponseDto } from './participant-response.dto';

export class SettlementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deliveryGroupId: string;

  @ApiProperty({ example: 3000 })
  deliveryFee: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string;

  @ApiProperty({ type: SettlementItemResponseDto, isArray: true })
  items: SettlementItemResponseDto[];
}

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

  @ApiProperty({ type: ParticipantResponseDto })
  participant?: ParticipantResponseDto;
}
