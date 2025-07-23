/*
  Warnings:

  - You are about to drop the column `stock` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "stock",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;
