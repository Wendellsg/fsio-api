-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "accountVerifyToken" TEXT;
