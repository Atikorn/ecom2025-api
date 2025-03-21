/*
  Warnings:

  - Made the column `orderedById` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_orderedById_fkey`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `amount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `currentcy` VARCHAR(191) NOT NULL DEFAULT 'THB',
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD COLUMN `stripePaymentId` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `orderedById` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_orderedById_fkey` FOREIGN KEY (`orderedById`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
