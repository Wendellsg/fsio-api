/*
  Warnings:

  - A unique constraint covering the columns `[accountVerifyToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_accountVerifyToken_key" ON "User"("accountVerifyToken");
