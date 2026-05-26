import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateDeliveryGroupDto,
  ListDeliveryGroupsQueryDto,
  ReplaceMyMenuRequestsDto,
} from './dto';

import { PrismaService } from 'src/prisma';
import { DeliveryGroupStatus } from 'generated/prisma/enums';

import type { AuthenticatedUser } from 'src/auth';
import type { DeliveryGroup } from 'generated/prisma/client';

@Injectable()
export class DeliveryGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(user: AuthenticatedUser, query: ListDeliveryGroupsQueryDto) {
    const onlyMine = query.mine === 'true';
    return this.prisma.deliveryGroup.findMany({
      orderBy: { createdAt: 'desc' },
      include: { participants: true },
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(onlyMine
          ? { participants: { some: { userId: user.userId } } }
          : {}),
      },
    });
  }

  async findOne(id: string) {
    const deliveryGroup = await this.prisma.deliveryGroup.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            menuRequests: true,
          },
        },
        settlement: true,
      },
    });
    if (!deliveryGroup) throw new NotFoundException('Delivery Group not found');
    return deliveryGroup;
  }

  create(user: AuthenticatedUser, dto: CreateDeliveryGroupDto) {
    return this.prisma.deliveryGroup.create({
      data: {
        title: dto.title,
        storeName: dto.storeName,
        pickupPlace: dto.pickupPlace,
        recruitmentDeadline: dto.recruitmentDeadline,
        maxParticipants: dto.maxParticipants,
        organizerUserId: user.userId,
        organizerDisplayNameSnapshot: user.displayName,
        participants: {
          create: {
            userId: user.userId,
            displayNameSnapshot: user.displayName,
          },
        },
      },
      include: {
        participants: true,
      },
    });
  }

  async join(id: string, user: AuthenticatedUser) {
    const deliveryGroup = await this.prisma.deliveryGroup.findUnique({
      where: { id },
      include: {
        participants: {
          where: {
            userId: user.userId,
          },
        },
        _count: { select: { participants: true } },
      },
    });

    // validation layer
    // 존재하며 -> 모집 중 / 데드라인 이전 -> 이미 참여한 배달 그룹이 아니며 -> 가득차지 않은 경우 참가 가능
    this.assertDeliveryGroupExists(deliveryGroup);
    this.assertDeliveryGroupIsRecruiting(deliveryGroup);
    this.assertRecruitmentDeadlineOpen(deliveryGroup);

    if (deliveryGroup.participants.length > 0)
      throw new ConflictException('이미 참여한 배달 그룹입니다.');

    if (deliveryGroup._count.participants >= deliveryGroup.maxParticipants)
      throw new ConflictException('참여 가능 인원이 가득 찼습니다.');

    return this.prisma.participant.create({
      data: {
        deliveryGroupId: id,
        userId: user.userId,
        displayNameSnapshot: user.displayName,
      },
    });
  }

  async cancel(id: string, user: AuthenticatedUser) {
    const deliveryGroup = await this.prisma.deliveryGroup.findUnique({
      where: { id },
    });

    this.assertDeliveryGroupExists(deliveryGroup);
    this.assertIsOrganizer(deliveryGroup, user);
    this.assertDeliveryGroupIsRecruiting(deliveryGroup);

    return this.prisma.deliveryGroup.update({
      where: { id },
      data: {
        status: DeliveryGroupStatus.CANCELED,
      },
    });
  }

  async leave(id: string, user: AuthenticatedUser) {
    const deliveryGroup = await this.prisma.deliveryGroup.findUnique({
      where: { id },
      include: {
        participants: {
          where: {
            userId: user.userId,
          },
        },
      },
    });

    this.assertDeliveryGroupExists(deliveryGroup);
    this.assertDeliveryGroupIsRecruiting(deliveryGroup);
    this.assertRecruitmentDeadlineOpen(deliveryGroup);

    if (deliveryGroup.organizerUserId === user.userId)
      throw new ConflictException('생성자는 탈퇴할 수 없습니다.');

    const participant = deliveryGroup.participants[0];
    if (!participant)
      throw new NotFoundException('참여 정보를 찾을 수 없습니다.');

    await this.prisma.participant.delete({
      where: {
        id: participant.id,
      },
    });

    return { success: true };
  }

  async replaceMyMenuRequests(
    id: string,
    user: AuthenticatedUser,
    dto: ReplaceMyMenuRequestsDto,
  ) {
    const deliveryGroup = await this.prisma.deliveryGroup.findUnique({
      where: { id },
      include: {
        participants: {
          where: {
            userId: user.userId,
          },
        },
      },
    });

    this.assertDeliveryGroupExists(deliveryGroup);
    this.assertDeliveryGroupIsRecruiting(deliveryGroup);
    this.assertRecruitmentDeadlineOpen(deliveryGroup);

    const participant = deliveryGroup.participants[0];
    if (!participant)
      throw new NotFoundException('참여 정보를 찾을 수 없습니다.');

    await this.prisma.$transaction(async (tx) => {
      await tx.menuRequest.deleteMany({
        where: { participantId: participant.id },
      });
      if (dto.menuRequests.length > 0) {
        await tx.menuRequest.createMany({
          data: dto.menuRequests.map((item) => ({
            participantId: participant.id,
            menuName: item.menuName,
            optionText: item.optionText,
            price: item.price,
            quantity: item.quantity,
            note: item.note,
          })),
        });
      }
    });

    return this.prisma.participant.findUniqueOrThrow({
      where: { id: participant.id },
      include: { menuRequests: true },
    });
  }

  async closeOrder(id: string, user: AuthenticatedUser) {
    const deliveryGroup = await this.prisma.deliveryGroup.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            menuRequests: true,
          },
        },
      },
    });

    // 오더를 닫을 수 있는건 생성자 뿐
    // 우선 그룹이 존재 -> 생성자이고 -> 리크루팅 상태여야 닫을 수 있는 상태임.
    this.assertDeliveryGroupExists(deliveryGroup);
    this.assertIsOrganizer(deliveryGroup, user);
    this.assertDeliveryGroupIsRecruiting(deliveryGroup);

    // 모든 참여자는 메뉴를 하나 이상 등록해 함.
    const participantWithoutMenuRequest = deliveryGroup.participants.find(
      (p) => p.menuRequests.length === 0,
    );
    if (participantWithoutMenuRequest)
      throw new ConflictException(
        '모든 참여자는 하나 이상의 메뉴를 주문해야 합니다.',
      );

    return this.prisma.deliveryGroup.update({
      where: { id },
      data: {
        status: DeliveryGroupStatus.ORDER_CLOSED,
      },
      include: {
        participants: {
          include: {
            menuRequests: true,
          },
        },
      },
    });
  }

  // 검증 헬퍼 함수들

  private assertDeliveryGroupExists(
    deliveryGroup: DeliveryGroup | null,
  ): asserts deliveryGroup is DeliveryGroup {
    if (!deliveryGroup)
      throw new NotFoundException('배달 그룹을 찾을 수 없습니다.');
  }

  private assertDeliveryGroupIsRecruiting(deliveryGroup: DeliveryGroup) {
    if (deliveryGroup.status !== DeliveryGroupStatus.RECRUITING)
      throw new ConflictException(
        '모집 중인 배달 그룹에서만 수행할 수 있습니다.',
      );
  }

  private assertIsOrganizer(
    deliveryGroup: DeliveryGroup,
    user: AuthenticatedUser,
  ) {
    if (deliveryGroup.organizerUserId !== user.userId)
      throw new ForbiddenException('생성자만 배달 그룹을 취소할 수 있습니다.');
  }

  private assertRecruitmentDeadlineOpen(deliveryGroup: DeliveryGroup) {
    if (deliveryGroup.recruitmentDeadline <= new Date())
      throw new ConflictException('모집 마감 시간이 지난 배달 그룹입니다.');
  }
}
