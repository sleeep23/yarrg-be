import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { DeliveryGroupsService } from './delivery-groups.service';
import { CurrentUser, MockAuthGuard } from 'src/auth';
import {
  CreateDeliveryGroupDto,
  ListDeliveryGroupsQueryDto,
  PlaceOrderDto,
  ReplaceMyMenuRequestsDto,
} from './dto';

import type { AuthenticatedUser } from 'src/auth';

@Controller('delivery-groups')
export class DeliveryGroupsController {
  constructor(private readonly deliveryGroupsService: DeliveryGroupsService) {}

  @Get()
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListDeliveryGroupsQueryDto,
  ) {
    return this.deliveryGroupsService.findAll(user, query);
  }

  @Get(':id')
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.deliveryGroupsService.findOne(id);
  }

  @Post()
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDeliveryGroupDto,
  ) {
    return this.deliveryGroupsService.create(user, dto);
  }

  @Post(':id/cancel')
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  cancel(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.cancel(id, user);
  }

  @Post(':id/participants')
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  join(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.join(id, user);
  }

  @Delete(':id/participants/me')
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  leave(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.leave(id, user);
  }

  @Put(':id/my-menu-requests')
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  replaceMyMenuRequests(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReplaceMyMenuRequestsDto,
  ) {
    return this.deliveryGroupsService.replaceMyMenuRequests(id, user, dto);
  }

  @Post(':id/close-order')
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  closeOrder(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.closeOrder(id, user);
  }

  @Post(':id/place-order')
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  placeOrder(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PlaceOrderDto,
  ) {
    return this.deliveryGroupsService.placeOrder(id, user, dto);
  }

  @Post(':id/arrive')
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  arrive(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.arrive(id, user);
  }

  @Post(':id/complete')
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  complete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.complete(id, user);
  }

  @Get(':id/settlement')
  @UseGuards(MockAuthGuard)
  @ApiBearerAuth()
  findSettlement(@Param('id') id: string) {
    return this.deliveryGroupsService.findSettlement(id);
  }
}
