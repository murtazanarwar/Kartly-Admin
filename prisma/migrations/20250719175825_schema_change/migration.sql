/*
  Warnings:

  - Made the column `customerId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "customerId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");
