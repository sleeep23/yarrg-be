import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UpdatePaymentConfirmationDto } from './dto';

import type { AuthenticatedUser } from 'src/auth';

@Injectable()
export class SettlementItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async updatePaymentConfirmation(
    id: string,
    user: AuthenticatedUser,
    dto: UpdatePaymentConfirmationDto,
  ) {
    const settlementItem = await this.prisma.settlementItem.findUnique({
      where: { id },
      include: {
        settlement: {
          include: {
            deliveryGroup: true,
          },
        },
      },
    });

    if (!settlementItem)
      throw new NotFoundException('정산 항목을 찾을 수 없습니다.');
    if (user.userId !== settlementItem.settlement.deliveryGroup.organizerUserId)
      throw new ForbiddenException('생성자만 수행할 수 있습니다.');

    return this.prisma.settlementItem.update({
      where: { id },
      data: {
        isPaid: dto.isPaid,
        paidAt: dto.isPaid ? new Date() : null,
      },
    });
  }
}
