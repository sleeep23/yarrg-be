import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdatePaymentConfirmationDto {
  @ApiProperty()
  @IsBoolean()
  isPaid: boolean;
}
