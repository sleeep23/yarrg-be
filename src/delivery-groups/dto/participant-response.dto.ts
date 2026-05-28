import { ApiProperty } from '@nestjs/swagger';
import { MenuRequestResponseDto } from './menu-request-response.dto';

export class ParticipantResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deliveryGroupId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ example: '서동호' })
  displayNameSnapshot: string;

  @ApiProperty({ type: String, format: 'date-time' })
  joinedAt: string;

  @ApiProperty({ type: MenuRequestResponseDto, isArray: true })
  menuRequests?: MenuRequestResponseDto[];
}
