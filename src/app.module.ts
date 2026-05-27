import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth';
import { DeliveryGroupsModule } from './delivery-groups/delivery-groups.module';
import { SettlementItemsModule } from './settlement-items/settlement-items.module';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    DeliveryGroupsModule,
    SettlementItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
