/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `LoyaltyPoint` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyPoint_customerId_key" ON "LoyaltyPoint"("customerId");
