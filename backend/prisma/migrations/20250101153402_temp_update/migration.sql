/*
  Warnings:

  - A unique constraint covering the columns `[userId,campaignId]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Coupon_userId_campaignId_key" ON "Coupon"("userId", "campaignId");
