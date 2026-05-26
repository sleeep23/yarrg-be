import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PlaceOrderDto {
  @ApiProperty({ minimum: 1, example: 45 })
  @IsInt()
  @Min(1)
  estimatedArrivalMinutes: number;
  @ApiProperty({ minimum: 0, example: 3000 })
  @IsInt()
  @Min(0)
  deliveryFee: number;
}
