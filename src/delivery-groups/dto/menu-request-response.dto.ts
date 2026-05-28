import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MenuRequestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  participantId: string;

  @ApiProperty({ example: '김치찌개' })
  menuName: string;

  @ApiPropertyOptional({ example: '돼지고기 포함' })
  optionText?: string;

  @ApiProperty({ example: 8000 })
  price: number;

  @ApiProperty({ example: 1 })
  quantity: number;

  @ApiPropertyOptional({ example: '젓가락 주세요' })
  note?: string | null;
}
