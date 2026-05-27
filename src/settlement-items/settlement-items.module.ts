import { Module } from '@nestjs/common';
import { SettlementItemsController } from './settlement-items.controller';
import { SettlementItemsService } from './settlement-items.service';

@Module({
  controllers: [SettlementItemsController],
  providers: [SettlementItemsService],
})
export class SettlementItemsModule {}
