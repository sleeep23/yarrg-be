import { DeliveryGroupStatus } from 'generated/prisma/enums';
import { ParticipantResponseDto } from './participant-response.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeliveryGroupResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional({ example: '김밥 드실 분들 찾아요' })
  title?: string;

  @ApiProperty({ example: '김밥천국' })
  storeName: string;

  @ApiProperty({ example: '학생기숙사 A동 로비' })
  pickupPlace: string;

  @ApiProperty({ type: String, format: 'date-time' })
  recruitmentDeadline: Date;

  @ApiProperty({ minimum: 1 })
  maxParticipants: number;

  @ApiProperty({ enum: DeliveryGroupStatus })
  status: DeliveryGroupStatus;

  @ApiProperty()
  organizerUserId: string;

  @ApiProperty({ example: '서동호' })
  organizerDisplayNameSnapshot: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  orderedAt?: string | null;

  @ApiPropertyOptional({ example: 45 })
  estimatedArrivalMinutes?: number | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  arrivedAt?: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  completedAt?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: Date;

  @ApiPropertyOptional({ type: () => ParticipantResponseDto, isArray: true })
  participants?: ParticipantResponseDto[];
}
