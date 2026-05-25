import { Module } from '@nestjs/common';
import { DeliveryGroupsController } from './delivery-groups.controller';
import { DeliveryGroupsService } from './delivery-groups.service';

@Module({
  controllers: [DeliveryGroupsController],
  providers: [DeliveryGroupsService],
})
export class DeliveryGroupsModule {}
