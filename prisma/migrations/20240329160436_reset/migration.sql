/*
  Warnings:

  - The values [legs,arms,back,chest,abs,cardio] on the enum `ExerciseCategoryEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `endDate` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resetPasswordToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endDateTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExerciseCategoryEnum_new" AS ENUM ('ankleAndFeet', 'knees', 'hipAndPelvis', 'thoracicAndLowBack', 'cervical', 'fistsAndHands', 'shoulders', 'elbowsAndForearms');
ALTER TABLE "Exercise" ALTER COLUMN "category" TYPE "ExerciseCategoryEnum_new" USING ("category"::text::"ExerciseCategoryEnum_new");
ALTER TYPE "ExerciseCategoryEnum" RENAME TO "ExerciseCategoryEnum_old";
ALTER TYPE "ExerciseCategoryEnum_new" RENAME TO "ExerciseCategoryEnum";
DROP TYPE "ExerciseCategoryEnum_old";
COMMIT;

-- AlterEnum
ALTER TYPE "ExtensionEnum" ADD VALUE 'webp';

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "endDate",
ADD COLUMN     "endDateTime" TEXT NOT NULL,
ADD COLUMN     "startDateTime" TEXT NOT NULL,
ADD COLUMN     "timeZone" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");
