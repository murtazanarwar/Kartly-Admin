/*
  Warnings:

  - A unique constraint covering the columns `[email,username,storeId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_username_storeId_key" ON "Customer"("email", "username", "storeId");
