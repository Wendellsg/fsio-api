/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `FileUploaded` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Professional` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Professional` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProfessionalTitleEnum" AS ENUM ('dra', 'dr');

-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "title" "ProfessionalTitleEnum" NOT NULL DEFAULT 'dr';

-- CreateIndex
CREATE UNIQUE INDEX "FileUploaded_key_key" ON "FileUploaded"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Professional_email_key" ON "Professional"("email");
