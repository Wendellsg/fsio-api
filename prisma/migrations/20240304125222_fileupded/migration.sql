/*
  Warnings:

  - Made the column `key` on table `FileUploaded` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FileUploaded" ALTER COLUMN "key" SET NOT NULL;
