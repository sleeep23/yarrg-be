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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { DeliveryGroupsService } from './delivery-groups.service';
import { JwtAuthGuard } from 'src/auth';
import {
  CreateDeliveryGroupDto,
  DeliveryGroupResponseDto,
  LeaveDeliveryGroupResponseDto,
  ListDeliveryGroupsQueryDto,
  ParticipantResponseDto,
  PlaceOrderDto,
  PlaceOrderResponseDto,
  ReplaceMyMenuRequestsDto,
} from './dto';

import type { AuthenticatedUser } from 'src/auth';
import { CurrentUser } from 'src/auth/decorator';
import { SettlementResponseDto } from 'src/settlement-items/dto';

@Controller('delivery-groups')
export class DeliveryGroupsController {
  constructor(private readonly deliveryGroupsService: DeliveryGroupsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DeliveryGroupResponseDto, isArray: true })
  @ApiOperation({ summary: '배달 그룹 목록 전체 조회' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListDeliveryGroupsQueryDto,
  ) {
    return this.deliveryGroupsService.findAll(user, query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DeliveryGroupResponseDto })
  @ApiOperation({ summary: 'id로 배달 그룹 단일 조회' })
  findOne(@Param('id') id: string) {
    return this.deliveryGroupsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: DeliveryGroupResponseDto })
  @ApiOperation({ summary: '배달 그룹 생성' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDeliveryGroupDto,
  ) {
    return this.deliveryGroupsService.create(user, dto);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DeliveryGroupResponseDto })
  @ApiOperation({ summary: '배달 그룹 취소 상태로 전환' })
  cancel(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.cancel(id, user);
  }

  @Post(':id/participants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ParticipantResponseDto })
  @ApiOperation({ summary: '특정 배달 그룹 참여' })
  join(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.join(id, user);
  }

  @Delete(':id/participants/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: LeaveDeliveryGroupResponseDto })
  @ApiOperation({ summary: '현재 사용자의 배달 그룹 참여 취소' })
  leave(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.leave(id, user);
  }

  @Put(':id/my-menu-requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ParticipantResponseDto })
  @ApiOperation({
    summary: '배달 그룹 내 특정 유저가 등록한 메뉴 목록 변경',
  })
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
  @ApiOkResponse({ type: DeliveryGroupResponseDto })
  @ApiOperation({
    summary: '배달 그룹 참여자들이 더 이상 메뉴를 등록할 수 없는 상태로 전환',
  })
  closeOrder(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.closeOrder(id, user);
  }

  @Post(':id/place-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PlaceOrderResponseDto })
  @ApiOperation({ summary: '배달 그룹이 주문 완료 상태로 전환' })
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
  @ApiOkResponse({ type: DeliveryGroupResponseDto })
  @ApiOperation({ summary: '배달 그룹 도착 상태로 전환' })
  arrive(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.arrive(id, user);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DeliveryGroupResponseDto })
  @ApiOperation({ summary: '배달 그룹 완료 상태로 전환' })
  complete(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deliveryGroupsService.complete(id, user);
  }

  @Get(':id/settlement')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: SettlementResponseDto })
  @ApiOperation({ summary: '배달 그룹 정산 정보 조회' })
  findSettlement(@Param('id') id: string) {
    return this.deliveryGroupsService.findSettlement(id);
  }
}
