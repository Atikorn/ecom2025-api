/*
  Warnings:

  - You are about to drop the column `createdAt` on the `addressonorder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `addressonorder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `addressonorder` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `addressId` INTEGER NULL;
