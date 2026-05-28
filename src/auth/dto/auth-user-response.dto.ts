import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({ example: 'f1234567-89ab-cdef-0123-456789abcdef' })
  userId: string;

  @ApiProperty({ example: 'John Doe' })
  displayName: string;
}
