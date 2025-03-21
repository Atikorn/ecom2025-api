/*
  Warnings:

  - You are about to drop the `addressonorder` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `addressId` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `addressonorder` DROP FOREIGN KEY `AddressOnOrder_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `addressonorder` DROP FOREIGN KEY `AddressOnOrder_orderId_fkey`;

-- AlterTable
ALTER TABLE `order` MODIFY `addressId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `addressonorder`;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
