import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { SettlementItemsService } from './settlement-items.service';
import { SettlementItemResponseDto, UpdatePaymentConfirmationDto } from './dto';
import { JwtAuthGuard } from 'src/auth';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
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
  @ApiOkResponse({ type: SettlementItemResponseDto })
  @ApiOperation({ summary: '정산 항목 결제 확인 상태 변경' })
  updatePaymentConfirmation(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePaymentConfirmationDto,
  ) {
    return this.settlementItemsService.updatePaymentConfirmation(id, user, dto);
  }
}
