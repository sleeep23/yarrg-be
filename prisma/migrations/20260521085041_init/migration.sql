-- CreateEnum
CREATE TYPE "DeliveryGroupStatus" AS ENUM ('RECRUITING', 'ORDER_CLOSED', 'ORDER_PLACED', 'ARRIVED', 'COMPLETED', 'CANCELED');

-- CreateTable
CREATE TABLE "DeliveryGroup" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "storeName" TEXT NOT NULL,
    "pickupPlace" TEXT NOT NULL,
    "recruitmentDeadline" TIMESTAMP(3) NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "status" "DeliveryGroupStatus" NOT NULL DEFAULT 'RECRUITING',
    "organizerUserId" TEXT NOT NULL,
    "organizerDisplayNameSnapshot" TEXT NOT NULL,
    "orderedAt" TIMESTAMP(3),
    "estimatedArrivalMinutes" INTEGER,
    "arrivedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "deliveryGroupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayNameSnapshot" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuRequest" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "menuName" TEXT NOT NULL,
    "optionText" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "MenuRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "deliveryGroupId" TEXT NOT NULL,
    "deliveryFee" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementItem" (
    "id" TEXT NOT NULL,
    "settlementId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "menuTotal" INTEGER NOT NULL,
    "deliveryFeeShare" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "SettlementItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Participant_userId_idx" ON "Participant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_deliveryGroupId_userId_key" ON "Participant"("deliveryGroupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Settlement_deliveryGroupId_key" ON "Settlement"("deliveryGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementItem_settlementId_participantId_key" ON "SettlementItem"("settlementId", "participantId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_deliveryGroupId_fkey" FOREIGN KEY ("deliveryGroupId") REFERENCES "DeliveryGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuRequest" ADD CONSTRAINT "MenuRequest_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_deliveryGroupId_fkey" FOREIGN KEY ("deliveryGroupId") REFERENCES "DeliveryGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementItem" ADD CONSTRAINT "SettlementItem_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SettlementItem" ADD CONSTRAINT "SettlementItem_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
