import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { SettlementItemsService } from './settlement-items.service';
import { UpdatePaymentConfirmationDto } from './dto';
import { JwtAuthGuard } from 'src/auth';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { AuthenticatedUser } from 'src/auth';
import { CurrentUser } from 'src/auth/decorator';

@Controller('settlement-items')
export class SettlementItemsController {
  constructor(
    private readonly settlementItemsService: SettlementItemsService,
  ) {}

  @Patch(':id/payment-confirmation')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  find(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePaymentConfirmationDto,
  ) {
    return this.settlementItemsService.updatePaymentConfirmation(id, user, dto);
  }
}
