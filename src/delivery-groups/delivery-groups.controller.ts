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
import { JwtAuthGuard } from 'src/auth';
import {
  CreateDeliveryGroupDto,
  ListDeliveryGroupsQueryDto,
  PlaceOrderDto,
  ReplaceMyMenuRequestsDto,
} from './dto';

import type { AuthenticatedUser } from 'src/auth';
import { CurrentUser } from 'src/auth/decorator';

@Controller('delivery-groups')
export class DeliveryGroupsController {
  constructor(private readonly deliveryGroupsService: DeliveryGroupsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListDeliveryGroupsQueryDto,
  ) {
    return this.deliveryGroupsService.findAll(user, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.deliveryGroupsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDeliveryGroupDto,
  ) {
    return this.deliveryGroupsService.create(user, dto);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  cancel(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.cancel(id, user);
  }

  @Post(':id/participants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  join(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.join(id, user);
  }

  @Delete(':id/participants/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  leave(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.leave(id, user);
  }

  @Put(':id/my-menu-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  replaceMyMenuRequests(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReplaceMyMenuRequestsDto,
  ) {
    return this.deliveryGroupsService.replaceMyMenuRequests(id, user, dto);
  }

  @Post(':id/close-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  closeOrder(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.closeOrder(id, user);
  }

  @Post(':id/place-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  placeOrder(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PlaceOrderDto,
  ) {
    return this.deliveryGroupsService.placeOrder(id, user, dto);
  }

  @Post(':id/arrive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  arrive(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.arrive(id, user);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  complete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.complete(id, user);
  }

  @Get(':id/settlement')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findSettlement(@Param('id') id: string) {
    return this.deliveryGroupsService.findSettlement(id);
  }
}
