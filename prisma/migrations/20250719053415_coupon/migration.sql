/*
  Warnings:

  - A unique constraint covering the columns `[code,storeId]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storeId` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Coupon_code_key";

-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "storeId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Coupon_storeId_idx" ON "Coupon"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_storeId_key" ON "Coupon"("code", "storeId");
